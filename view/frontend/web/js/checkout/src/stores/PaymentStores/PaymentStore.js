import { defineStore } from 'pinia';

import mitt from 'mitt';

import getPaymentInformation from '@/services/payments/getPaymentInformation';

export default defineStore('paymentStore', {
  state: () => ({
    methodsResponse: [],
    clientKey: '',
    cache: {},
    errorMessage: '',
    rvvupErrorMessage: '',
    paymentEmitter: mitt(),
    availableMethods: [],
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
