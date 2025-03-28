/* eslint-disable import/no-cycle */
import mitt from 'mitt';
import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useLoadingStore from '@/stores/LoadingStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import addCartItem from '@/services/cart/addCartItem';
import addGiftCardCode from '@/services/giftCard/addGiftCardCode';
import addDiscountCode from '@/services/discount/addDiscountCode';
import getAmastyShippingInfo from '@/services/shipping/getAmastyShippingInfo';
import getCartData from '@/services/cart/getCartData';
import getCrosssells from '@/services/cart/getCrosssells';
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

import getDummyCartItems from '@/helpers/dummyContent/getDummyCartItems';
import getDummyGiftCards from '@/helpers/dummyContent/getDummyGiftCards';
import getDummyCartPrices from '@/helpers/dummyContent/getDummyCartPrices';
import getDummyShippingAddresses from '@/helpers/dummyContent/getDummyShippingAddresses';
import getDummyCrossSellItems from '@/helpers/dummyContent/getDummyCrossSellItems';
import getCartItems from '@/helpers/cart/getCartItems';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getLocalMaskedId from '@/helpers/cart/getLocalMaskedId';
import redirectToBasketPage from '@/helpers/cart/redirectToBasketPage';
import discountCodeDataLayer from '@/helpers/dataLayer/discountCodeDataLayer';
import giftCardCodeDataLayer from '@/helpers/dataLayer/giftCardCodeDataLayer';

export default defineStore('cartStore', {
  state: () => ({
    id: null,
    cart: {
      applied_gift_cards: getDummyGiftCards(),
      items: getDummyCartItems(),
      prices: getDummyCartPrices(),
      shipping_addresses: getDummyShippingAddresses(),
      is_virtual: false,
    },
    customer_is_guest: null,
    subtotalInclTax: null,
    totalSegments: [],
    discountCode: '',
    giftCardCode: getDummyGiftCards()[0].code,
    discountErrorMessage: "The code isn't valid. Verify the code and try again.",
    giftCardErrorMessage: null,
    data: {},
    crosssells: getDummyCrossSellItems(),
    amastyData: {},
    amastyEnabled: false,
    freeShipping: null,
    cache: {},
    cartEmitter: mitt(),
    maskedId: getLocalMaskedId(),
  }),
  getters: {
    isItemRequiringDelivery: (state) => (
      Object.values(state.cartItems).some(({ product_type: productType }) => (
        productType !== 'giftcard' && productType !== 'virtual'
      ))
    ),
    getTotalSegment: (state) => (
      (segment) => state.totalSegments.find(({ code }) => code === segment)
    ),
    cartItems: (state) => (
      state.cart.items
    ),
    getCartItemsQty: (state) => (
      state.cart.items.reduce((prev, curr) => {
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
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getCart() {
      // Prevent this from running within the admin.
    },

    async getCartData() {
      const data = await this.getCachedResponse(getCartData, 'getCartData');
      const customerStore = useCustomerStore();
      const { amastySubs } = customerStore;
      if (!Object.keys(amastySubs).length && data.checkboxes) {
        Object.keys(data.checkboxes).forEach((checkbox) => {
          customerStore.updateAmastySubscription({
            [checkbox]: data.checkboxes[checkbox].is_prechecked,
          });
        });
      }
      return data;
    },

    // This handles storing the cart data in the correct store location.
    handleCartData(cart) {
      if (cart && cart.items.length) {
        const localItems = getCartItems();
        const mappedCartItems = cart.items.map((item) => (
          { ...localItems[item.id], ...item }
        ));
        this.setData({
          cart: {
            items: mappedCartItems,
          },
        });
      } else {
        redirectToBasketPage();
        return;
      }

      this.setData({
        cart,
        discountCode: cart?.applied_coupons?.[0]?.code ?? '',
        giftCardCode: cart?.applied_gift_cards?.[0]?.code ?? '',
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
      }

      paymentStore.setPaymentMethods(cart.available_payment_methods);

      shippingMethodsStore.setShippingMethods(cart?.shipping_addresses?.[0]?.available_shipping_methods ?? []);
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
    },

    async removeDiscountCode() {
      try {
        discountCodeDataLayer('discountCodeRemoved');
        const cart = await removeDiscountCode();

        this.setData({
          cart,
          discountErrorMessage: null,
        });
      } catch (error) {
        this.setData({
          discountErrorMessage: error.message,
        });
      }
    },

    async addGiftCardCode(code) {
      try {
        const cart = await addGiftCardCode(code);

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
    },

    async removeGiftCardCode(code) {
      giftCardCodeDataLayer('giftCardCodeRemoved');
      try {
        const cart = await removeGiftCardCode(code);

        this.setData({
          cart,
          giftCardErrorMessage: null,
        });
      } catch (error) {
        this.setData({
          giftCardErrorMessage: error.message,
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

    async getAmastyShippingData() {
      const data = await this.getCachedResponse(getAmastyShippingInfo, 'getAmastyShippingInfo');
      if (Object.keys(data).length > 0) {
        this.setData({
          amastyData: data,
          amastyEnabled: true,
        });
      } else {
        this.setData({
          amastyEnabled: false,
        });
      }
      this.calculateFreeShipping();
    },

    async addCartItem(product) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      try {
        const cart = await addCartItem(product);
        this.setData({ cart });
      } catch (error) {
        console.warn('Unable to add cart item', error.message);
      }
      this.clearCaches(['getCrosssells']);
      await this.getCrosssells();
      this.calculateFreeShipping();

      // Also trigger refresh of User's cart data.
      refreshCustomerData(getCartSectionNames());

      const gtmStore = useGtmStore();
      gtmStore.addToCartEvent(product);

      setLoadingState(false);
    },

    calculateFreeShipping() {
      const { goal } = this.amastyData;

      if (goal) {
        this.setData({
          freeShipping: goal - this.subtotalInclTax,
        });
      }
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
