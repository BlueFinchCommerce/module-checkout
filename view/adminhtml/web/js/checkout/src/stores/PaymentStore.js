import { defineStore } from 'pinia';

import mitt from 'mitt';

import getStoreConfig from '@/services/getStoreConfig';
import getAdyenPaymentMethods from '@/services/getAdyenPaymentMethods';
import getPaymentInformation from '@/services/getPaymentInformation';
import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';

export default defineStore('paymentStore', {
  state: () => ({
    methodsResponse: [],
    loadingPaymentMethods: false,
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
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },
    async getPaymentMethodsResponse() {
      this.loadingPaymentMethods = true;
      const request = async () => getAdyenPaymentMethods();
      const getPaymentMethodsResponse = await this
        .getCachedResponse(request, 'getAdyenPaymentMethods');
      this.loadingPaymentMethods = false;
      return getPaymentMethodsResponse;
    },
    async getAdyenClientKey() {
      // Early return if we already have this information.
      if (this.clientKey) {
        return this.clientKey;
      }

      this.loadingPaymentMethods = true;
      const config = getAdyenProductionMode() ? 'adyen_client_key_live' : 'adyen_client_key_test';
      const getPaymentMethodsResponse = await this.getCachedResponse(
        getStoreConfig,
        'getAdyenClientKey',
        [config],
      );
      this.$patch({ clientKey: getPaymentMethodsResponse[config] });
      this.loadingPaymentMethods = false;
      return getPaymentMethodsResponse[config];
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

    async getPaymentMethods() {
      const { payment_methods: paymentMethods } = await this.getCachedResponse(
        getPaymentInformation,
        'getPaymentInformation',
      );
      this.setPaymentMethods(paymentMethods);
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
    clearPaymentReponseCache() {
      this.clearCaches(['getAdyenPaymentMethods', 'getPaymentInformation']);
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
