/* eslint-disable import/no-cycle */
import { defineStore } from 'pinia';
import afdPostcode from '@/services/addresses/afdPostcode';
import getStoreConfig from '@/services/getStoreConfig';
import getBlock from '@/services/content/getBlock';
import getStoreCode from '@/services/getStoreCode';
import getPrivacyPolicyId from '@/helpers/content/getPrivacyPolicyId';
import getGeneralTermsServicesId from '@/helpers/content/getGeneralTermsServicesId';
import getWithdrawTermsServicesId from '@/helpers/content/getWithdrawTermsServicesId';
import getFallBackStaticPath from '@/helpers/storeConfigs/getFallBackStaticPath';
import getStoreCodeFromLocalStorage from '@/helpers/storeConfigs/getStoreCode';
import getLocale from '@/helpers/addresses/getLocale';
import getCurrencyCode from '@/helpers/payment/getCurrencyCode';
import getStoreConfigsAndCountries from '@/helpers/storeConfigs/getStoreConfigsAndCountries';

export default defineStore('configStore', {
  state: () => ({
    staticUrl: getFallBackStaticPath(),
    currencyCode: getCurrencyCode(),
    storeCode: getStoreCodeFromLocalStorage(),
    locale: getLocale(),
    countryCode: undefined,
    rvvupPaymentsActive: false,
    cache: {},
    privacyPolicy: {},
    generalTermsServices: {},
    withdrawTermsServices: {},
    countries: [],
    secureBaseUrl: undefined,
    useStoreInUrl: false,
    newsletterEnabled: false,
    newsletterAllowGuests: false,
    stateRequired: [],
    displayState: false,
    rewardsEnabled: false,
    clickandcollectSms: false,
    custom: {},
    optionalZipCountries: '',
    addressFinder: {
      enabled: true,
      loqate: {},
      afd: {},
    },
    websiteName: '',
    taxCartDisplayPrice: false,
    taxCartDisplayShipping: false,
    taxCartDisplayFullSummary: false,
    copyrightText: '',
    progressBarVisible: false,
  }),
  getters: {
    postcodeRequired: (state) => (
      (countryId) => !state.optionalZipCountries.includes(countryId)
    ),
    getCountryByCode: (state) => (
      (countryCode) => state.countries.find(({ id }) => id === countryCode)
    ),
    getRegionId: (state) => (
      (countryCode, regionCode) => {
        const country = state.getCountryByCode(countryCode);
        return country && country.available_regions
          ? country.available_regions.find(({ code }) => code === regionCode)?.id
          : undefined;
      }
    ),
  },
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

    async getStoreCode() {
      const storeCode = await getStoreCode();
      this.setData({
        storeCode,
      });
    },

    async getStoreConfig() {
      if (!this.storeCode) {
        await this.getCachedResponse(this.getStoreCode, 'getStoreCode');
      }

      this.getCachedResponse(getStoreConfigsAndCountries, 'getStoreConfigsAndCountries');
    },

    setLocale(locale) {
      const replaced = locale.replace('_', '-');
      const countryCode = replaced.split('-')[1];
      this.$i18n.global.locale = replaced;
      this.setData({
        countryCode,
        locale: replaced,
      });
    },

    async getRvvupConfig() {
      const configs = [
        'rvvup_payments_active',
      ];
      const data = await this.getConfig(configs);

      if (data) {
        this.setData({
          rvvupPaymentsActive: !!Number(data.rvvup_payments_active),
        });
      }
    },
    createCacheKey(configs) {
      return configs.join('-');
    },
    getRegionsByCountry(countryId) {
      const country = this.countries.find((cty) => cty.id === countryId);
      if (country) {
        const availableRegions = country.available_regions || [];
        const regionOptions = availableRegions.map((region) => (
          {
            option: {
              name: region.name,
              value: region.id,
              code: region.code,
            },
          }
        ));
        return regionOptions;
      }

      return [];
    },
    async getPrivacyPolicyBlock() {
      const privacyPolicyId = getPrivacyPolicyId();

      if (privacyPolicyId) {
        const data = await this.getCachedResponse(
          getBlock,
          'getPrivacyPolicyBlock',
          privacyPolicyId,
        );
        this.setData({
          privacyPolicy: data,
        });
      }
    },
    async getGeneralTermsServicesBlock() {
      const generalTermsServicesId = getGeneralTermsServicesId();

      if (generalTermsServicesId) {
        const data = await this.getCachedResponse(
          getBlock,
          'getGeneralTermsServicesBlock',
          generalTermsServicesId,
        );
        this.setData({
          generalTermsServices: data,
        });
      }
    },
    async getWithdrawTermsServicesBlock() {
      const withdrawTermsServicesId = getWithdrawTermsServicesId();

      if (withdrawTermsServicesId) {
        const data = await this.getCachedResponse(
          getBlock,
          'getWithdrawTermsServicesBlock',
          withdrawTermsServicesId,
        );
        this.setData({
          withdrawTermsServices: data,
        });
      }
    },

    async getLoqateConfiguration() {
      const configApi = await this.getConfig(['gene_better_checkout_loqate_api_key']);
      const configStatus = await this.getConfig(['gene_better_checkout_loqate_enabled']);

      this.setData({
        addressFinder: {
          enabled: !!+configStatus.gene_better_checkout_loqate_enabled,
          loqate: {
            enabled: !!+configStatus.gene_better_checkout_loqate_enabled,
            apiKey: configApi.gene_better_checkout_loqate_api_key,
          },
        },
      });
    },

    async getAfdConfiguration() {
      const config = await this.getCachedResponse(
        afdPostcode.getAfdConfiguration,
        'getAfdConfiguration',
      );

      this.setData({
        addressFinder: {
          afd: {
            type: config.afd_general_account_type,
            serialUrl: config.afd_general_account_serial_url,
            serial: config.afd_general_account_serial,
            password: config.afd_general_account_password,
            idUrl: config.afd_general_account_id_url,
            id: config.afd_general_account_id,
            token: config.afd_general_account_token,
            maxQuantity: config.afd_response_max_quantity || '5',
          },
        },
      });
    },

    async getAfdStatus() {
      const configStatus = await this.getConfig(['gene_better_checkout_afd_enable']);

      this.setData({
        addressFinder: {
          afd: {
            enabled: configStatus.gene_better_checkout_afd_enable,
          },
        },
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
    clearCache(cacheKey) {
      if (cacheKey) {
        this.setData({
          cache: {
            [cacheKey]: undefined,
          },
        });
      }
    },
  },
});
