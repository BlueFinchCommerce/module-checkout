/* eslint-disable import/no-cycle */
import { defineStore } from 'pinia';
import afdPostcode from '@/services/afdPostcode';
import getStoreConfig from '@/services/getStoreConfig';
import getBlock from '@/services/getBlock';
import getCountries from '@/services/getCountries';
import getStoreCode from '@/services/getStoreCode';
import getCustomConfigs from '@/helpers/getCustomConfigs';
import getPrivacyPolicyId from '@/helpers/getPrivacyPolicyId';
import getGeneralTermsServicesId from '@/helpers/getGeneralTermsServicesId';
import getWithdrawTermsServicesId from '@/helpers/getWithdrawTermsServicesId';
import mapCustomConfigs from '@/helpers/mapCustomConfigs';
import getFallBackStaticPath from '@/helpers/getFallBackStaticPath';
import getStoreCodeFromLocalStorage from '@/helpers/getStoreCode';
import getLocale from '@/helpers/getLocale';
import getCurrencyCode from '@/helpers/getCurrencyCode';

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
  }),
  getters: {
    postcodeRequired: (state) => (
      (countryId) => !state.optionalZipCountries.includes(countryId)
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

      const configs = [
        'base_static_url',
        'default_display_currency_code',
        'code',
        'secure_base_url',
        'use_store_in_url',
        'website_name',
        'gene_better_checkout_newsletter_enabled',
        'gene_better_checkout_newsletter_allow_guest',
        'gene_better_checkout_country_state_required',
        'gene_better_checkout_country_display_state',
        'magento_reward_general_is_enabled',
        'magento_reward_general_is_enabled_on_front',
        'optional_zip_countries',
        'tax_cart_display_price',
        'tax_cart_display_shipping',
        'tax_cart_display_full_summary',
        'gene_better_checkout_copyright_text',
        'gene_better_checkout_afd_enable',
      ];

      if (this.locale) {
        this.setLocale(this.locale);
      } else {
        configs.push('locale');
      }

      const promises = [];

      if (!this.countries.length) {
        promises.push(this.getCachedResponse(this.getCountries, 'getCountries'));
      }

      const allConfigs = configs.concat(getCustomConfigs);

      const getConfigRequest = this.getConfig(allConfigs).then(async (data) => {
        this.setData({
          staticUrl: data.base_static_url.replace(/\/+$/, ''),
          currencyCode: data.default_display_currency_code,
          storeCode: data.code,
          useStoreInUrl: data.use_store_in_url,
          websiteName: data.website_name || '',
          secureBaseUrl: data.secure_base_url,
          newsletterEnabled: data.gene_better_checkout_newsletter_enabled === '1',
          newsletterAllowGuests: data.gene_better_checkout_newsletter_allow_guest === '1',
          stateRequired: data.gene_better_checkout_country_state_required
            ? data.gene_better_checkout_country_state_required.split(',') : [],
          displayState: data.gene_better_checkout_country_display_state === '1',
          rewardsEnabled: data.magento_reward_general_is_enabled === '1'
            && data.magento_reward_general_is_enabled_on_front === '1',
          optionalZipCountries: data.optional_zip_countries || '',
          taxCartDisplayPrice: data.tax_cart_display_price === '2',
          taxCartDisplayShipping: data.tax_cart_display_shipping === '2',
          taxCartDisplayFullSummary: data.tax_cart_display_full_summary === '1',
          copyrightText: data.gene_better_checkout_copyright_text,
          afdStatus: data.gene_better_checkout_afd_enable,
        });

        if (data.locale) {
          this.setLocale(data.locale);
        }

        const customConfigs = await mapCustomConfigs(data);
        this.setData({
          custom: customConfigs,
        });
      });

      promises.push(getConfigRequest);

      await Promise.all(promises);
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
    async getCountries() {
      const { data } = await getCountries();
      this.setData(data);
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
