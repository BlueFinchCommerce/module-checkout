import { defineStore } from 'pinia';

import getCartPaymentMethods from '@/helpers/cart/getCartPaymentMethods';

import mitt from 'mitt';

export default defineStore('paymentStore', {
  state: () => ({
    methodsResponse: [],
    clientKey: '',
    cache: {},
    errorMessage: '',
    rvvupErrorMessage: '',
    paymentEmitter: mitt(),
    availableMethods: getCartPaymentMethods(),
    expressMethods: [],
    hasVaultedMethods: false,
  }),
  getters: {
    methodsResponse: (state) => state.methodsResponse,
    clientKey: (state) => state.clientKey,
    isPaymentMethodAvailable: (state) => (
      (paymentMethod) => state.availableMethods.some(({ code }) => code === paymentMethod)
    ),
    getPaymentMethodTitle: (state) => (
      (paymentMethod) => {
        const method = state.availableMethods.find(({ code }) => code === paymentMethod);
        return method ? method.title : null;
      }
    ),
    getPaymentPriority: (state) => (
      (paymentMethod) => state.availableMethods.findIndex(({ code }) => code === paymentMethod)
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

    setRvvupErrorMessage(message) {
      this.setData({
        rvvupErrorMessage: message,
      });
    },

    setPaymentMethods(paymentMethods) {
      this.setData({
        availableMethods: paymentMethods,
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

    setHasVaultedMethods() {
      this.setData({
        hasVaultedMethods: true,
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
