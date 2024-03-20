import { defineStore } from 'pinia';
import getHokodoCustomerData from '@/services/payments/getHokodoCustomerData';

export default defineStore('HokodoStore', {
  state: () => ({
    hokodo: {},
    offer: {},
    companyId: null,
    cache: {},
  }),
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getHokodoConfigs() {
      const config = await this.getCachedResponse(
        getHokodoCustomerData.getHokodoConfigs,
        'getHokodoConfigs',
      );

      const hokodoData = config.storeConfig;

      this.setData({
        hokodo: {
          hokodoData: {
            ...hokodoData,
            hokodo_sdk_countries: hokodoData.hokodo_sdk_countries.split(','),
          },
        },
      });
    },

    async getHokodoCompanyId() {
      const config = await this.getCachedResponse(
        getHokodoCustomerData.getHokodoCompanyId,
        'getHokodoCompanyId',
      );

      this.setCompanyId(config.hokodoUser);
    },

    setOffer(offer) {
      this.setData({
        offer,
      });
    },

    setCompanyId(companyId) {
      this.setData({
        companyId,
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
  },
});
