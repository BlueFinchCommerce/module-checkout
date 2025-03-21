import { defineStore } from 'pinia';

import getCartPaymentMethods from '@/helpers/cart/getCartPaymentMethods';

import mitt from 'mitt';

export default defineStore('paymentStore', {
  state: () => ({
    methodsResponse: [],
    clientKey: '',
    cache: {},
    errorMessage: '',
    paymentErrorMessage: '',
    paymentEmitter: mitt(),
    availableMethods: getCartPaymentMethods(),
    expressMethods: [],
    hasVaultedMethods: false,
    firstOpenController: 'braintree',
    selectedMethod: null,
  }),
  getters: {
    methodsResponse: (state) => state.methodsResponse,
    clientKey: (state) => state.clientKey,
    isPaymentMethodAvailable: (state) => (paymentMethod) => Array.isArray(state.availableMethods)
      && state.availableMethods.some(({ code }) => code === paymentMethod),
    getPaymentMethodTitle: (state) => (
      (paymentMethod) => {
        const method = Array.isArray(state.availableMethods)
          && state.availableMethods.find(({ code }) => code === paymentMethod);
        return method ? method.title : null;
      }
    ),
    getPaymentPriority: (state) => (
      (paymentMethod) => Array.isArray(state.availableMethods)
        && state.availableMethods.findIndex(({ code }) => code === paymentMethod)
    ),
    isExpressPaymentsVisible: (state) => (
      state.expressMethods.length
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },
    setErrorMessage(message) {
      this.setData({
        errorMessage: message,
      });
    },
    setPaymentErrorMessage(message) {
      this.setData({
        paymentErrorMessage: message,
      });
    },

    setPaymentMethods(paymentMethods) {
      this.setData({
        availableMethods: paymentMethods,
      });

      this.selectPaymentMethod(paymentMethods[0].code);
    },

    selectPaymentMethod(selectedMethod) {
      this.setData({
        selectedMethod,
      });
    },

    addExpressMethod(method) {
      this.setData({
        expressMethods: this.$state.expressMethods.concat([method]),
      });
    },

    removeExpressMethod(method) {
      this.setData({
        expressMethods: this.$state.expressMethods.filter((expressMethod) => expressMethod !== method),
      });
    },

    setHasVaultedMethods(value) {
      this.setData({
        hasVaultedMethods: value,
      });
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
  },
});
