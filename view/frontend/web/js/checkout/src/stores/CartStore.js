/* eslint-disable import/no-cycle */
import mitt from 'mitt';
import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/GtmStore';
import usePaymentStore from '@/stores/PaymentStore';

import addCartItem from '@/services/cart/addCartItem';
import addGiftCardCode from '@/services/giftCard/addGiftCardCode';
import addDiscountCode from '@/services/discount/addDiscountCode';
import getAmastyShippingInfo from '@/services/getAmastyShippingInfo';
import getCart from '@/services/cart/getCart';
import getCartData from '@/services/getCartData';
import getCrosssells from '@/services/getCrosssells';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import mergeGuestCart from '@/services/mergeGuestCart';
import removeCartItem from '@/services/cart/removeCartItem';
import removeGiftCardCode from '@/services/giftCard/removeGiftCardCode';
import updateCartItemQuantity from '@/services/cart/updateCartItemQuantity';
import removeDiscountCode from '@/services/discount/removeDiscountCode';
import removeRewardPoints from '@/services/removeRewardPoints';
import useRewardPoints from '@/services/useRewardPoints';
import useStoreCredit from '@/services/storeCredit/useStoreCredit';
import refreshCustomerData from '@/services/refreshCustomerData';
import removeStoreCredit from '@/services/storeCredit/removeStoreCredit';
import pennies from '@/services/penniesCharityBox';

import getCartItems from '@/helpers/getCartItems';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getMaskedId from '@/helpers/getMaskedId';
import redirectToBasketPage from '@/helpers/redirectToBasketPage';

export default defineStore('cartStore', {
  state: () => ({
    id: null,
    cart: {
      items: getCartItems(),
    },
    customer_is_guest: null,
    subtotalInclTax: null,
    totalSegments: [],
    cartLoading: false,
    discountCode: '',
    giftCardCode: '',
    discountErrorMessage: null,
    giftCardErrorMessage: null,
    data: {},
    crosssells: [],
    amastyData: {},
    amastyEnabled: false,
    freeShipping: null,
    cache: {},
    cartEmitter: mitt(),
    maskedId: getMaskedId(),
    penniesDonation: {
      logo: null,
      amount: null,
      enabled: false,
      isAvailable: true,
    },
    rewards: {
      used: false,
    },
  }),
  getters: {
    agreementIds: (state) => {
      const { agreements } = state.data;
      const agreementValues = agreements ? Object.values(agreements) : [];
      return agreementValues.map((agreementValue) => agreementValue.agreementId);
    },
    hasPenniesDonation: (state) => (
      state.totalSegments.some((segment) => segment.code === 'penniesdonation' && segment.value > 0)
    ),
    isItemRequiringDelivery: (state) => (
      Object.values(state.cartItems).some(({ product_type: productType }) => (
        productType !== 'giftcard' && productType !== 'virtual'
      ))
    ),
    getTotalSegment: (state) => (
      (segment) => state.totalSegments.find(({ code }) => code === segment)
    ),
    getTotalSegmentValue: (state) => (
      (segment) => state.getTotalSegment(segment)?.value
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
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getCart() {
      const cart = await this.getCachedResponse(getCart, 'getCart');

      this.handleCartData(cart);
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

      customerStore.setEmailAddress(cart.email ?? '');
    },

    async updateQuantity(updateItem, change) {
      this.cartLoading = 'true';

      try {
        const cart = await updateCartItemQuantity(updateItem, change);
        this.handleCartData(cart);
      } catch (error) {
        // Add the error message to the cart item.
        const { items } = this.cart;
        items.map((item) => {
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

        this.setData({ cart: { items } });
      }

      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }

      // Also trigger refresh of User's cart data.
      await refreshCustomerData(getCartSectionNames());

      // Emit update GTM event.
      const gtmStore = useGtmStore();
      if (change > 0) {
        gtmStore.addToCartEvent(updateItem);
      } else {
        gtmStore.removeFromCartEvent(updateItem);
      }

      this.cartLoading = 'false';
    },

    async removeItem(product) {
      this.cartLoading = 'true';

      try {
        const cart = await removeCartItem(product.uid);
        this.handleCartData(cart);
      } catch (error) {
        console.warn('Unable to remove cart item', error.message);
      }

      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }

      this.clearCaches(['getCrosssells']);
      await this.getCrosssells();

      // Also trigger refresh of User's cart data.
      await refreshCustomerData(getCartSectionNames());

      const gtmStore = useGtmStore();
      gtmStore.removeFromCartEvent(product, product.qty);

      this.cartLoading = 'false';
    },

    async addDiscountCode(code) {
      try {
        const cart = await addDiscountCode(code);

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

    async removeDiscountCode() {
      try {
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

      if (this.penniesDonation.enabled) {
        this.setData({
          penniesDonation: { isAvailable: true },
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

        this.setData({
          cart,
          giftCardErrorMessage: null,
        });
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

    updateAgreementData(agreement, approved) {
      this.setData({
        data: {
          agreements: {
            [agreement.agreementId]: {
              approved,
            },
          },
        },
      });
    },

    validateAgreements() {
      const { agreements } = this.data;
      const agreementValues = agreements ? Object.values(agreements) : [];
      // If there are no agreements then it must be auto approved.
      if (!agreementValues.length) {
        return true;
      }

      const updatedAgreements = agreementValues.map((agreement) => (
        {
          ...agreement,
          valid: agreement.mode !== '1' || agreement.approved === true,
        }
      ));

      updatedAgreements.forEach((updatedAgreement) => {
        this.setData({
          data: {
            agreements: {
              [updatedAgreement.agreementId]: {
                ...updatedAgreement,
              },
            },
          },
        });
      });

      const unaprovedAgreements = updatedAgreements.some((agreement) => (
        agreement.mode === '1' && agreement.valid === false
      ));

      return !unaprovedAgreements;
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
      this.cartLoading = 'true';
      try {
        const cart = await addCartItem(product);
        this.setData({ cart });
      } catch (error) {
        console.warn('Unable to add cart item', error.message);
      }
      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }
      this.clearCaches(['getCrosssells']);
      await this.getCrosssells();
      this.calculateFreeShipping();

      // Also trigger refresh of User's cart data.
      await refreshCustomerData(getCartSectionNames());

      const gtmStore = useGtmStore();
      gtmStore.addToCartEvent(product);

      this.cartLoading = 'false';
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
      this.clearCaches(['getPaymentInformation']);

      this.$state.cartEmitter.emit('cartUpdated');

      // Also trigger refresh of User's cart data.
      await refreshCustomerData(getCartSectionNames());
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
      await useRewardPoints();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

      this.emitUpdate();
    },

    async removeRewardPoints() {
      await removeRewardPoints();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

      this.emitUpdate();
    },

    async useStoreCredit() {
      if (!this.maskedId) {
        const maskedId = await getMaskedIdFromGraphQl();
        this.setData({ maskedId });
      }
      await useStoreCredit();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

      this.emitUpdate();
    },

    async removeStoreCredit() {
      if (!this.maskedId) {
        const maskedId = await getMaskedIdFromGraphQl();
        this.setData({ maskedId });
      }
      await removeStoreCredit();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

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
