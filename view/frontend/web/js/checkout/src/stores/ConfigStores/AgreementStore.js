import { defineStore } from 'pinia';

import getAgreements from '@/services/agreements/getAgreements';

export default defineStore('agreementStore', {
  state: () => ({
    cache: {},
    agreements: {},
  }),
  getters: {
    agreementIds: (state) => {
      const agreementValues = state.agreements ? Object.values(state.agreements) : [];
      return agreementValues.map((agreementValue) => agreementValue.agreement_id);
    },
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getAgreements() {
      const agreements = await this.getCachedResponse(getAgreements, 'getAgreements');

      // Map the agreements to an object so we can call it using IDs.
      const formattedAgreements = agreements.reduce((prev, curr) => {
        const allAgreements = prev;

        allAgreements[curr.agreement_id] = curr;

        return allAgreements;
      }, {});

      this.setData({ agreements: formattedAgreements });
    },

    updateAgreementData(agreement, approved) {
      this.setData({
        agreements: {
          [agreement.agreement_id]: {
            approved,
          },
        },
      });
    },

    validateAgreements() {
      const { agreements } = this;
      const agreementValues = agreements ? Object.values(agreements) : [];
      // If there are no agreements then it must be auto approved.
      if (!agreementValues.length) {
        return true;
      }

      const updatedAgreements = agreementValues.map((agreement) => (
        {
          ...agreement,
          valid: agreement.mode !== 'MANUAL' || agreement.approved === true,
        }
      ));

      updatedAgreements.forEach((updatedAgreement) => {
        this.setData({
          agreements: {
            [updatedAgreement.agreement_id]: {
              ...updatedAgreement,
            },
          },
        });
      });

      const unaprovedAgreements = updatedAgreements.some((agreement) => (
        agreement.mode === 'MANUAL' && agreement.valid === false
      ));

      return !unaprovedAgreements;
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
