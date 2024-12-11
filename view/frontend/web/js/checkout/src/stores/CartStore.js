/* eslint-disable import/no-cycle */
import mitt from 'mitt';
import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useLoadingStore from '@/stores/LoadingStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import addCartItem from '@/services/cart/addCartItem';
import addGiftCardCode from '@/services/giftCard/addGiftCardCode';
import addDiscountCode from '@/services/discount/addDiscountCode';
import getCart from '@/services/cart/getCart';
import getCartData from '@/services/cart/getCartData';
import getCrosssells from '@/services/cart/getCrosssells';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import mergeGuestCart from '@/services/cart/mergeGuestCart';
import removeCartItem from '@/services/cart/removeCartItem';
import removeGiftCardCode from '@/services/giftCard/removeGiftCardCode';
import updateCartItemQuantity from '@/services/cart/updateCartItemQuantity';
import removeDiscountCode from '@/services/discount/removeDiscountCode';
import removeRewardPoints from '@/services/reward/removeRewardPoints';
import useRewardPoints from '@/services/reward/useRewardPoints';
import useStoreCredit from '@/services/storeCredit/useStoreCredit';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import removeStoreCredit from '@/services/storeCredit/removeStoreCredit';
import pennies from '@/services/payments/penniesCharityBox';

import getCartItems from '@/helpers/cart/getCartItems';
import getCartPrices from '@/helpers/cart/getCartPrices';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getIsVirtual from '@/helpers/cart/getIsVirtual';
import getLocalMaskedId from '@/helpers/cart/getLocalMaskedId';
import redirectToBasketPage from '@/helpers/cart/redirectToBasketPage';
import discountCodeDataLayer from '@/helpers/dataLayer/discountCodeDataLayer';
import giftCardCodeDataLayer from '@/helpers/dataLayer/giftCardCodeDataLayer';

import functionExtension from '@/extensions/functionExtension';

export default defineStore('cartStore', {
  state: () => ({
    id: null,
    cart: {
      items: getCartItems(),
      prices: getCartPrices(),
      is_virtual: getIsVirtual(),
    },
    customer_is_guest: null,
    subtotalInclTax: null,
    totalSegments: [],
    discountCode: '',
    giftCardCode: '',
    discountErrorMessage: null,
    giftCardErrorMessage: null,
    data: {},
    crosssells: [],
    freeShipping: null,
    cache: {},
    cartEmitter: mitt(),
    maskedId: getLocalMaskedId(),
    penniesDonation: {
      logo: null,
      amount: null,
      enabled: false,
      isAvailable: true,
    },
  }),
  getters: {
    hasPenniesDonation: (state) => (
      state.totalSegments.some((segment) => segment.code === 'penniesdonation' && segment.value > 0)
    ),
    getTotalSegment: (state) => (
      (segment) => state.totalSegments.find(({ code }) => code === segment)
    ),
    cartItems: (state) => (
      state.cart.items
    ),
    getCartItemsQty: (state) => (
      Object.values(state.cartItems).reduce((prev, curr) => {
        const totalQuantity = prev + curr.quantity;
        return totalQuantity;
      }, 0)
    ),
    cartGrandTotal: (state) => (
      state.cart?.prices?.grand_total?.value
        ? Math.round(state.cart.prices.grand_total.value * 100)
        : 0
    ),
    cartDiscountTotal: (state) => (
      state.cart.prices?.discounts?.reduce((prev, { amount }) => (prev + amount.value), 0) || 0
    ),
    getCouponValue: (state) => (
      (coupon) => state.cart.prices.discounts?.find((discount) => discount.label.includes(coupon))?.amount?.value || 0
    ),
    getGiftWrappingTotal: (state) => (
      state.cart.items.reduce((prev, curr) => {
        if (!curr.gift_wrapping) {
          return prev;
        }

        return prev + curr.gift_wrapping.price.value;
      }, state.cart.gift_wrapping?.price?.value || 0)
    ),
    getShippingMethods: (state) => (
      state.cart.shipping_addresses?.[0]?.available_shipping_methods?.filter(({ available, isVisible }) => (
        available && isVisible
      ))
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getCart() {
      if (!this.maskedId) {
        const maskedId = await this.getMaskedId();
        this.setData({ maskedId });
      }

      await this.getCachedResponse(() => getCart().then(this.handleCartData), 'getCart');
    },

    async getMaskedId() {
      const maskedId = await this.getCachedResponse(getMaskedIdFromGraphQl, 'getMaskedIdFromGraphQl');
      return maskedId;
    },

    async getCartData() {
      const data = await this.getCachedResponse(getCartData, 'getCartData');
      return data;
    },

    // This handles storing the cart data in the correct store location.
    async handleCartData(cart) {
      // If there is no cart whatsoever or we have got items but the array is empty then redirect ot basket.
      if (!cart || ('items' in cart && !cart.items.length)) {
        redirectToBasketPage();
        return;
      }

      if (cart.items) {
        const localItems = getCartItems();
        const mappedCartItems = cart.items.map((item) => (
          { ...localItems[item.id], ...item }
        ));
        this.setData({
          cart: {
            items: mappedCartItems,
          },
        });
      }

      if (cart?.shipping_addresses?.[0]?.available_shipping_methods) {
        // eslint-disable-next-line no-param-reassign
        cart.shipping_addresses[0].available_shipping_methods = cart.shipping_addresses[0]
          .available_shipping_methods.map((method) => ({
            isVisible: true,
            ...method,
          }));
      }

      const configStore = useConfigStore();
      await functionExtension('onHandleCartData', [cart, configStore]);

      if (typeof cart.applied_coupons !== 'undefined') {
        this.setData({
          discountCode: cart?.applied_coupons?.[0]?.code ?? '',
        });
      }

      if (typeof cart.applied_gift_cards !== 'undefined') {
        this.setData({
          giftCardCode: cart?.applied_gift_cards?.[0]?.code ?? '',
        });
      }

      this.setData({
        cart,
      });

      const customerStore = useCustomerStore();
      const paymentStore = usePaymentStore();
      const shippingMethodsStore = useShippingMethodsStore();

      customerStore.setEmailAddress(cart.email ?? '');

      if (cart.billing_address) {
        customerStore.setAddressToStore(cart.billing_address, 'billing');
      }

      if (cart.shipping_addresses.length) {
        customerStore.setAddressToStore(cart.shipping_addresses[0], 'shipping');
        shippingMethodsStore.setShippingDataFromCartData(cart);
      }

      if (cart.available_payment_methods) {
        paymentStore.setPaymentMethods(cart.available_payment_methods);
      }
    },

    async updateQuantity(updateItem, change) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      try {
        const cart = await updateCartItemQuantity(updateItem, change);
        this.handleCartData(cart);
        this.emitUpdate();
      } catch (error) {
        // Add the error message to the cart item.
        const { items } = this.cart;
        const updatedItems = items.map((item) => {
          if (item.uid === updateItem.uid) {
            return {
              ...item,
              errors: [{
                message: error.message,
              }],
            };
          }

          return item;
        });

        this.setData({ cart: { items: updatedItems } });
      }

      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }

      // Also trigger refresh of User's cart data.
      refreshCustomerData(getCartSectionNames());

      // Emit update GTM event.
      const gtmStore = useGtmStore();

      if (change > 0) {
        gtmStore.addToCartEvent(updateItem.product);
      } else {
        gtmStore.removeFromCartEvent(updateItem.product);
      }

      setLoadingState(false);
    },

    async removeItem(product) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      try {
        const cart = await removeCartItem(product.uid);
        this.handleCartData(cart);
        this.emitUpdate();
      } catch (error) {
        console.warn('Unable to remove cart item', error.message);
      }

      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }

      this.clearCaches(['getCrosssells']);
      await this.getCrosssells();

      // Also trigger refresh of User's cart data.
      refreshCustomerData(getCartSectionNames());

      const gtmStore = useGtmStore();
      gtmStore.removeFromCartEvent(product.product, product.quantity);

      setLoadingState(false);
    },

    async addDiscountCode(code) {
      try {
        const cart = await addDiscountCode(code);

        this.handleCartData(cart);
        this.emitUpdate();
        this.setData({
          cart,
          discountErrorMessage: null,
        });
        discountCodeDataLayer('discountCodeApplied');
      } catch (error) {
        this.setData({
          discountErrorMessage: error.message,
        });
      }

      if (this.penniesDonation.enabled) {
        this.setData({
          penniesDonation: { isAvailable: true },
        });
      }
    },

    async removeDiscountCode() {
      try {
        discountCodeDataLayer('discountCodeRemoved');
        const cart = await removeDiscountCode();

        this.handleCartData(cart);
        this.emitUpdate();
        this.setData({
          cart,
          discountErrorMessage: null,
        });
      } catch (error) {
        this.setData({
          discountErrorMessage: error.message,
        });
      }

      if (this.penniesDonation.enabled) {
        this.setData({
          penniesDonation: { isAvailable: true },
        });
      }
    },

    async addGiftCardCode(code) {
      try {
        const cart = await addGiftCardCode(code);

        this.handleCartData(cart);
        this.emitUpdate();
        this.setData({
          cart,
          giftCardErrorMessage: null,
        });
        giftCardCodeDataLayer('giftCardCodeApplied');
      } catch (error) {
        this.setData({
          giftCardErrorMessage: error.message,
        });
      }

      if (this.penniesDonation.enabled) {
        this.setData({
          penniesDonation: { isAvailable: true },
        });
      }
    },

    async removeGiftCardCode(code) {
      try {
        const cart = await removeGiftCardCode(code);

        this.handleCartData(cart);
        this.emitUpdate();
        this.setData({
          cart,
          giftCardErrorMessage: null,
        });
        giftCardCodeDataLayer('giftCardCodeRemoved');
      } catch (error) {
        this.setData({
          giftCardErrorMessage: error.message,
        });
      }

      if (this.penniesDonation.enabled) {
        this.setData({
          penniesDonation: { isAvailable: true },
        });
      }
    },

    async mergeGuestCart(customerId, storeId) {
      const { maskedId } = this.$state;
      if (maskedId) {
        await mergeGuestCart(maskedId, customerId, storeId);
      }
    },

    async getCrosssells() {
      const crosssells = await this.getCachedResponse(
        getCrosssells,
        'getCrosssells',
        this.cart.items,
      );
      this.setData({
        crosssells,
      });
      return crosssells;
    },

    async addCartItem(product) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      try {
        const cart = await addCartItem(product);
        this.handleCartData(cart);
        this.emitUpdate();
      } catch (error) {
        console.warn('Unable to add cart item', error.message);
      }
      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }
      this.clearCaches(['getCrosssells']);
      await this.getCrosssells();

      // Also trigger refresh of User's cart data.
      refreshCustomerData(getCartSectionNames());

      const gtmStore = useGtmStore();
      gtmStore.addToCartEvent(product);

      setLoadingState(false);
    },

    getCachedResponse(request, cacheKey, args = {}) {
      if (typeof this.$state.cache[cacheKey] !== 'undefined') {
        return this.$state.cache[cacheKey];
      }

      const data = request(args);
      this.$patch({
        cache: {
          [cacheKey]: data,
        },
      });
      return data;
    },

    clearCaches(cacheKeys) {
      if (cacheKeys.length) {
        cacheKeys.forEach((cacheKey) => {
          this.setData({
            cache: {
              [cacheKey]: undefined,
            },
          });
        });
      }
    },

    clearAllCaches() {
      this.clearCaches(['getCart', 'getCrosssells']);
    },

    async emitUpdate() {
      this.$state.cartEmitter.emit('cartUpdated');

      // Also trigger refresh of User's cart data.
      refreshCustomerData(getCartSectionNames());
    },

    async addDonation() {
      await pennies.addCharityAmount();
      this.setData({
        penniesDonation: { isAvailable: false },
      });
      await this.calculateDonation();
      this.emitUpdate();
    },

    async removeDonation() {
      await pennies.removeCharityAmount();
      this.setData({
        penniesDonation: { isAvailable: true },
      });
      await this.calculateDonation();
      this.emitUpdate();
    },

    async calculateDonation() {
      const charityData = await pennies.getCharityAmount();
      this.setData({
        penniesDonation: {
          charityData,
          amount: (parseFloat(charityData.amount) / 100).toString(),
        },
      });
    },

    async penniesConfigs() {
      const data = await this.getCachedResponse(pennies.getPenniesConfigs, 'penniesConfigs');
      this.setData({
        penniesDonation: {
          logo: data.PenniesData.charity_logo_url,
          enabled: data.PenniesData.enabled === 'true',
        },
      });
    },

    async useRewardPoints() {
      const cart = await useRewardPoints();
      this.handleCartData(cart);

      this.emitUpdate();
    },

    async removeRewardPoints() {
      const cart = await removeRewardPoints();
      this.handleCartData(cart);

      this.emitUpdate();
    },

    async useStoreCredit() {
      const cart = await useStoreCredit();
      this.handleCartData(cart);

      this.emitUpdate();
    },

    async removeStoreCredit() {
      const cart = await removeStoreCredit();
      this.handleCartData(cart);

      this.emitUpdate();
    },

    clearCartItems(cartItemIds) {
      if (cartItemIds === 'all') {
        Object.keys(this.cartItems).forEach((cartItemId) => {
          delete this.cartItems[cartItemId];
        });
        return;
      }
      const cartItemsArray = Array.isArray(cartItemIds)
        ? cartItemIds
        : [cartItemIds];
      cartItemsArray.forEach((cartItemId) => {
        delete this.cartItems[cartItemId];
      });
    },
  },
});
