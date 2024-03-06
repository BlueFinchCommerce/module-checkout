/* eslint-disable import/no-cycle */
import mitt from 'mitt';
import { defineStore } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/GtmStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

import addCartItem from '@/services/addCartItem';
import addGiftCardCode from '@/services/addGiftCardCode';
import addDiscountCode from '@/services/addDiscountCode';
import getAmastyShippingInfo from '@/services/getAmastyShippingInfo';
import getCart from '@/services/getCart';
import getCartData from '@/services/getCartData';
import getCartTotals from '@/services/getCartTotals';
import getCrosssells from '@/services/getCrosssells';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import mergeGuestCart from '@/services/mergeGuestCart';
import removeCartItem from '@/services/removeCartItem';
import removeGiftCardCode from '@/services/removeGiftCardCode';
import updateCartItemQuantity from '@/services/updateCartItemQuantity';
import removeDiscountCode from '@/services/removeDiscountCode';
import removeRewardPoints from '@/services/removeRewardPoints';
import useRewardPoints from '@/services/useRewardPoints';
import useStoreCredit from '@/services/storeCredit/useStoreCredit';
import refreshCustomerData from '@/services/refreshCustomerData';
import removeStoreCredit from '@/services/storeCredit/removeStoreCredit';
import pennies from '@/services/penniesCharityBox';

import getDummyCartItems from '@/helpers/dummyContent/getDummyCartItems';
import getDummyCartTotals from '@/helpers/dummyContent/getDummyCartTotals';
import getCartItemsQuantity from '@/helpers/getCartItemsQuantity';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getMaskedId from '@/helpers/getMaskedId';
import redirectToBasketPage from '@/helpers/redirectToBasketPage';

export default defineStore('cartStore', {
  state: () => ({
    id: null,
    cartItems: getDummyCartItems(),
    cartItemsQty: getCartItemsQuantity(),
    customer_is_guest: null,
    cartGrandTotal: 9760,
    subtotalInclTax: null,
    isVirtual: undefined,
    totalSegments: getDummyCartTotals(),
    cartLoading: 'false',
    discountCode: '',
    giftCardCode: '',
    discountApplied: false,
    giftCardApplied: false,
    discountErrorMessage: null,
    giftCardErrorMessage: null,
    data: {},
    crosssells: [],
    amastyData: {},
    freeShipping: null,
    shippingPrice: null,
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
      typeof state.isVirtual !== 'undefined'
        ? !state.isVirtual
        : Object.values(state.cartItems).some(({ product_type: productType }) => (
          productType !== 'giftcard' && productType !== 'virtual'
        ))
    ),
    getTotalSegment: (state) => (
      (segment) => state.totalSegments.find(({ code }) => code === segment)
    ),
    getTotalSegmentValue: (state) => (
      (segment) => state.getTotalSegment(segment)?.value
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },
    async getCart() {
      const data = await this.getCachedResponse(getCart, 'getCart');
      const customerStore = useCustomerStore();
      const shippingMethodsStore = useShippingMethodsStore();
      if (data.customer.email) {
        customerStore.setData({ customer: data.customer });
        customerStore.submitEmail();
      } else if (data.billing_address.email) {
        const custData = {
          email: data.billing_address.email,
          firstname: data.billing_address.firstname,
          lastname: data.billing_address.lastname,
        };
        customerStore.setData({ customer: custData });
        customerStore.submitEmail();
      }
      if (data.items && data.items.length) {
        const items = {};
        const localItems = getCartItems();

        data.items.forEach((item) => {
          items[item.item_id] = { ...localItems[item.item_id], ...this.$state.cartItems[item.item_id], ...item };
        });

        this.setData({ cartItems: items });
      } else {
        redirectToBasketPage();
      }
      if (data.items_qty) {
        const itemsQty = data.items_qty;
        this.setData({ cartItemsQty: itemsQty });
      }
      if (typeof data.is_virtual !== 'undefined') {
        const isVirtual = data.is_virtual;
        this.setData({ isVirtual });
      }
      shippingMethodsStore.setShippingDataFromCartData(data);
      this.setData(data);
      return data;
    },
    /* eslint-disable  consistent-return */
    async getCartData() {
      try {
        const data = await this.getCachedResponse(getCartData, 'getCartData');
        if (data.quote && data.quote.items) {
          this.setData({ cartItems: { ...this.$state.cartItems, ...data.quote.items } });
        }
        if (data.agreements) {
          this.setData({ data: { ...this.$state.data, ...data } });
        }
        const customerStore = useCustomerStore();
        const { amastySubs } = customerStore;
        if (!Object.keys(amastySubs).length && data.checkboxes) {
          Object.keys(data.checkboxes).forEach((checkbox) => {
            customerStore.updateAmastySubscription({
              [checkbox]: data.checkboxes[checkbox].is_prechecked,
            });
          });
        }
        if (data.quote.items.length === 0) {
          redirectToBasketPage();
        }
        return data;
      } catch {
        redirectToBasketPage();
      }
    },
    async getCartTotals() {
      const data = await this.getCachedResponse(getCartTotals, 'getCartTotals');
      this.updateTotals(data);
    },
    async updateQuantity(product, change) {
      this.cartLoading = 'true';

      // Clear all existing messages from products.
      this.clearProductMessages();

      await updateCartItemQuantity(
        product.item_id,
        product.sku,
        product.qty + change,
        product.quote_id,
      ).then(async (response) => {
        if (response && response.item_id) {
          const data = [];
          data[response.item_id] = response;
          this.setData({ cartItems: { ...this.$state.cartItems, ...data } });
        }
        if (this.penniesDonation.enabled) {
          await this.calculateDonation();
        }

        this.cartLoading = false;

        // Get the updated shipping.
        const shippingMethodsStore = useShippingMethodsStore();
        shippingMethodsStore.clearShippingMethodCache();
        await shippingMethodsStore.getShippingMethods();

        this.cartLoading = 'true';

        // Get the updated totals.
        this.clearCaches(['getCartTotals']);
        await this.getCartTotals();

        this.cartLoading = 'false';

        this.emitUpdate();

        // Emit update GTM event.
        const gtmStore = useGtmStore();
        if (change > 0) {
          gtmStore.addToCartEvent(product);
        } else {
          gtmStore.removeFromCartEvent(product);
        }
      }, (response) => {
        const { message } = response.response.data;
        const formattedMessage = typeof message === 'string'
          ? message : 'The requested qty exceeds the maximum qty allowed in shopping cart.';
        Object.assign(product, { cartUpdateErrorMessage: formattedMessage });
        this.cartLoading = 'false';
      });
    },
    async removeItem(product) {
      const shippingMethodsStore = useShippingMethodsStore();
      const stepsStore = useStepsStore();
      this.cartLoading = 'true';
      this.clearAllCaches();
      await removeCartItem(product.item_id);

      // Force delete the item from the store.
      this.clearCartItems(product.item_id);

      await this.getCartData();
      await this.getCart();
      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }
      await this.getCartTotals();
      await this.getCrosssells();
      this.emitUpdate();
      await shippingMethodsStore.getShippingMethods();

      // Redirect customer to shipping step if there are no nominated date
      // and selected method is nominated delivery to prevent placing orders without nominated date

      if (!shippingMethodsStore.nominatedSelectedDate
        && shippingMethodsStore.selectedMethod?.method_title?.startsWith('Nominated')) {
        stepsStore.goToShipping();
      }

      const gtmStore = useGtmStore();
      gtmStore.removeFromCartEvent(product, product.qty);

      this.cartLoading = 'false';
    },
    updateTotals(totals) {
      const { taxCartDisplayShipping } = useConfigStore();
      if (totals.coupon_code) {
        this.setData({
          discountApplied: true,
          discountErrorMessage: null,
          discountCode: totals.coupon_code,
        });
      } else {
        this.setData({
          discountApplied: false,
          discountCode: '',
        });
      }

      // Find the gift card data from within the totals.
      const giftCard = totals.total_segments.find(({ code }) => code === 'giftcardaccount');
      if (giftCard) {
        this.setGiftCardData(giftCard);
      }

      if (totals.items) {
        const items = {};
        totals.items.forEach((item) => {
          items[item.item_id] = {
            ...this.$state.cartItems[item.item_id],
            ...item,
            options: JSON.parse(item.options),
          };
        });
        this.setData({ cartItems: items });
      }
      if (totals.items_qty) {
        const itemsQty = totals.items_qty;
        this.setData({ cartItemsQty: itemsQty });
      }
      this.setData({
        shippingPrice: taxCartDisplayShipping ? totals.shipping_incl_tax : totals.shipping_amount,
        cartGrandTotal: totals.base_grand_total * 100,
        totalSegments: totals.total_segments,
        subtotalInclTax: totals.subtotal_incl_tax,
      });
      this.setData({
        rewards: {
          used: totals.extension_attributes.reward_points_balance,
        },
      });
      this.calculateFreeShipping();
      const shippingMethodsStore = useShippingMethodsStore();
      shippingMethodsStore.setShippingMethodTitle(totals);
      return totals;
    },

    addDiscountCode(code) {
      return addDiscountCode(code).then((response) => {
        if (response === true) {
          this.$patch(response);
          this.setData({ discountApplied: response, discountErrorMessage: null });
          if (this.penniesDonation.enabled) {
            this.setData({
              penniesDonation: { isAvailable: true },
            });
          }
          this.clearCaches(['getCartTotals']);
          this.getCartTotals();
          this.emitUpdate();
        }
      }, (response) => {
        const { message } = response.response.data;
        this.discountErrorMessage = typeof message === 'string'
          ? message : 'The coupon could not be removed. Please try again.';
      });
    },

    setGiftCardData(giftCard) {
      const [info] = JSON.parse(giftCard.extension_attributes.gift_cards);

      this.setData({
        giftCardApplied: true,
        giftCardErrorMessage: null,
        giftCardCode: info.c,
      });
    },

    addGiftCardCode(code) {
      return addGiftCardCode(code).then((response) => {
        if (response === true) {
          this.$patch(response);
          this.setData({ giftCardApplied: response, giftCardErrorMessage: null });
          if (this.penniesDonation.enabled) {
            this.setData({
              penniesDonation: { isAvailable: true },
            });
          }
          this.clearCaches(['getCartTotals']);
          this.getCartTotals();
          this.emitUpdate();
        }
      }, (response) => {
        const { message } = response.response.data;
        this.giftCardErrorMessage = typeof message === 'string'
          ? message : 'The gift card could not be added. Please try again.';
      });
    },

    removeDiscountCode() {
      return removeDiscountCode().then((response) => {
        this.$patch(response);
        this.setData({ discountCode: '', discountApplied: false, discountErrorMessage: null });
        if (this.penniesDonation.enabled) {
          this.setData({
            penniesDonation: { isAvailable: true },
          });
        }
        this.clearCaches(['getCartTotals']);
        this.getCartTotals();
        this.emitUpdate();
      }, (response) => {
        const { message } = response.response.data;
        this.discountErrorMessage = typeof message === 'string'
          ? message : 'The coupon could not be removed. Please try again.';
      });
    },

    removeGiftCardCode(code) {
      return removeGiftCardCode(code).then((response) => {
        if (response === true) {
          this.$patch(response);
          this.setData({ giftCardCode: '', giftCardApplied: false, giftCardErrorMessage: null });
          if (this.penniesDonation.enabled) {
            this.setData({
              penniesDonation: { isAvailable: true },
            });
          }
          this.clearCaches(['getCartTotals']);
          this.getCartTotals();
          this.emitUpdate();
        }
      }, (response) => {
        const { message } = response.response.data;
        this.giftCardErrorMessage = typeof message === 'string'
          ? message : 'The gift card could not be removed. Please try again.';
      });
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
        this.cartItems,
      );
      this.setData({
        crosssells,
      });
      return crosssells;
    },
    async getAmastyShippingData() {
      const data = await this.getCachedResponse(getAmastyShippingInfo, 'getAmastyShippingInfo');
      if (data) {
        this.setData({
          amastyData: data,
        });
      }
      this.calculateFreeShipping();
    },
    async addCartItem(product) {
      this.cartLoading = 'true';
      const {
        sku,
      } = product;
      await addCartItem({
        sku, qty: 1, quote_id: this.id,
      });
      this.clearAllCaches();
      await this.getCartData();
      await this.getCart();
      if (this.penniesDonation.enabled) {
        await this.calculateDonation();
      }
      await this.getCartTotals();
      await this.getCrosssells();
      this.calculateFreeShipping();
      this.emitUpdate();

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
      this.clearCaches(['getCartData', 'getCart', 'getCartTotals', 'getCrosssells']);
    },
    async emitUpdate() {
      const shippingMethodsStore = useShippingMethodsStore();

      this.clearCaches(['getPaymentInformation']);

      shippingMethodsStore.clearShippingMethodCache();

      await shippingMethodsStore.getShippingMethods();

      this.$state.cartEmitter.emit('cartUpdated');

      // Also trigger refresh of User's cart data.
      await refreshCustomerData(getCartSectionNames());
    },
    async addDonation() {
      await pennies.addCharityAmount();
      this.setData({
        penniesDonation: { isAvailable: false },
      });
      this.clearCaches(['getCartTotals']);
      this.getCartTotals();
      await this.calculateDonation();
      this.emitUpdate();
    },
    async removeDonation() {
      await pennies.removeCharityAmount();
      this.setData({
        penniesDonation: { isAvailable: true },
      });
      this.clearCaches(['getCartTotals']);
      this.getCartTotals();
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

      this.clearCaches(['getCartTotals']);
      await this.getCartTotals();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

      this.emitUpdate();
    },
    async removeRewardPoints() {
      await removeRewardPoints();

      this.clearCaches(['getCartTotals']);
      await this.getCartTotals();

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

      this.clearCaches(['getCartTotals']);
      await this.getCartTotals();

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

      this.clearCaches(['getCartTotals']);
      await this.getCartTotals();

      const paymentStore = usePaymentStore();
      await paymentStore.refreshPaymentMethods();

      this.emitUpdate();
    },

    clearProductMessages() {
      Object.values(this.cartItems).forEach((product) => {
        Object.assign(product, { cartUpdateErrorMessage: null });
      });
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
