import { defineStore } from 'pinia';
import usePaymentStore from '@/stores/PaymentStore';

import getStoreConfig from '@/services/getStoreConfig';
import getAdyenPaymentMethods from '@/services/adyen/getAdyenPaymentMethods';
import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';

export default defineStore('adyenStore', {
  state: () => ({
    cache: {},
    clientToken: null,
    vaultActive: false,
    paymentTypes: [],
    isAdyenAvailable: false,
    adyenEnvironmentMode: 'live',
    adyenVaultEnabled: false,
    loadingPaymentMethods: true,
  }),
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getConfig(configs) {
      const cacheKey = this.createCacheKey(configs);

      const data = await this.getCachedResponse(getStoreConfig, cacheKey, configs);

      this.$patch({
        cache: {
          [cacheKey]: data,
        },
      });
      return data;
    },

    async getAdyenConfig() {
      const configs = [
        'adyen_environment_mode',
        'adyen_vault_enabled',
      ];
      const data = await this.getCachedResponse(this.getConfig, 'getAdyenConfig', configs);

      if (data) {
        this.setData({
          // Adyen's modes are '0' = live, '1' = test.
          adyenEnvironmentMode: data.adyen_environment_mode === '0' ? 'live' : 'test',
          adyenVaultEnabled: data.adyen_vault_enabled,
        });
      }
    },

    async getPaymentMethodsResponse() {
      this.loadingPaymentMethods = true;
      const request = async () => getAdyenPaymentMethods();
      const {
        paymentMethodsExtraDetails,
        paymentMethodsResponse,
      } = await this.getCachedResponse(request, 'getAdyenPaymentMethods');

      // Store the payment methods and icons.
      !this.paymentTypes.length && paymentMethodsResponse.paymentMethods.forEach((method) => {
        const { paymentTypes } = this;
        if (method.type === 'scheme') {
          method.brands.forEach((brand) => {
            paymentTypes.push({
              name: method.name,
              icon: `https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/${brand}.svg`,
            });
          });
        } else {
          paymentTypes.push({
            name: method.name,
            icon: paymentMethodsExtraDetails[method.type].icon.url,
          });
        }

        this.setData({
          paymentTypes,
        });
      });

      this.loadingPaymentMethods = false;
      return paymentMethodsResponse;
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

    async getIsAdyenAvailable() {
      const paymentStore = usePaymentStore();

      await paymentStore.getPaymentMethods();

      const isAdyenAvailable = paymentStore.availableMethods.some(({ code }) => code.includes('adyen'));

      this.setData({
        isAdyenAvailable,
      });
    },

    createCacheKey(configs) {
      return configs.join('-');
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
      this.clearCaches(['getAdyenPaymentMethods']);
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
