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
import getInitialConfig from '@/helpers/storeConfigs/getInitialConfig';
import getCustomConfigs from '@/helpers/storeConfigs/getCustomConfigs';
import mapCustomConfigs from '@/helpers/storeConfigs/mapCustomConfigs';
import handleInitialConfig from '@/helpers/storeConfigs/handleInitialConfig';

export default defineStore('configStore', {
  state: () => ({
    staticUrl: getFallBackStaticPath(),
    currencyCode: getCurrencyCode(),
    storeCode: getStoreCodeFromLocalStorage(),
    locale: getLocale(),
    countryCode: undefined,
    rvvupPaymentsActive: false,
    superPaymentsActive: false,
    cache: {},
    privacyPolicy: {},
    generalTermsServices: {},
    withdrawTermsServices: {},
    countries: [],
    secureBaseUrl: undefined,
    secureBaseLinkUrl: undefined,
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
    clickCollectTabsEnabled: false,
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

    /**
     * Very initial request to get all of the stores configuration.
     */
    async getInitialConfig() {
      if (!this.storeCode) {
        await this.getCachedResponse(this.getStoreCode, 'getStoreCode');
      }

      const request = () => getInitialConfig().then(handleInitialConfig);
      await this.getCachedResponse(request, 'getInitialConfig');
    },

    /**
     * Get the values for the initial configuration.
     */
    getInitialConfigValues() {
      const configs = [
        'base_static_url',
        'default_display_currency_code',
        'code',
        'secure_base_url',
        'secure_base_link_url',
        'use_store_in_url',
        'website_name',
        'bluefinch_checkout_newsletter_enabled',
        'bluefinch_checkout_newsletter_allow_guest',
        'bluefinch_checkout_country_state_required',
        'bluefinch_checkout_country_display_state',
        'magento_reward_general_is_enabled',
        'magento_reward_general_is_enabled_on_front',
        'optional_zip_countries',
        'tax_cart_display_price',
        'tax_cart_display_shipping',
        'tax_cart_display_full_summary',
        'bluefinch_checkout_copyright_text',
        'bluefinch_checkout_afd_enable',
        'bluefinch_checkout_progress_bar_visible',
        'bluefinch_checkout_loqate_api_key',
        'bluefinch_checkout_loqate_enabled',
        'bluefinch_checkout_click_collect_tabs_enabled',
        'bluefinch_checkout_afd_enable',
      ];

      if (this.locale) {
        this.setLocale(this.locale);
      } else {
        configs.push('locale');
      }

      const allConfigs = configs.concat(getCustomConfigs);

      return `
        storeConfig {
          ${allConfigs.join(' ')}
        }

        countries {
          id
          two_letter_abbreviation
          three_letter_abbreviation
          full_name_locale
          available_regions {
            id
            code
            name
          }
        }
      `;
    },

    async handleInitialConfig({ countries, storeConfig }) {
      this.setData({
        staticUrl: storeConfig.base_static_url.replace(/\/+$/, ''),
        currencyCode: storeConfig.default_display_currency_code,
        storeCode: storeConfig.code,
        useStoreInUrl: storeConfig.use_store_in_url,
        websiteName: storeConfig.website_name || '',
        secureBaseUrl: storeConfig.secure_base_url,
        secureBaseLinkUrl: storeConfig.secure_base_link_url,
        newsletterEnabled: storeConfig.bluefinch_checkout_newsletter_enabled === '1',
        newsletterAllowGuests: storeConfig.bluefinch_checkout_newsletter_allow_guest === '1',
        stateRequired: storeConfig.bluefinch_checkout_country_state_required
          ? storeConfig.bluefinch_checkout_country_state_required.split(',') : [],
        displayState: storeConfig.bluefinch_checkout_country_display_state === '1',
        rewardsEnabled: storeConfig.magento_reward_general_is_enabled === '1'
          && storeConfig.magento_reward_general_is_enabled_on_front === '1',
        optionalZipCountries: storeConfig.optional_zip_countries || '',
        taxCartDisplayPrice: storeConfig.tax_cart_display_price === '2',
        taxCartDisplayShipping: storeConfig.tax_cart_display_shipping === '2',
        taxCartDisplayFullSummary: storeConfig.tax_cart_display_full_summary === '1',
        copyrightText: storeConfig.bluefinch_checkout_copyright_text,
        progressBarVisible: storeConfig.bluefinch_checkout_progress_bar_visible === true,
        addressFinder: {
          enabled: !!+storeConfig.bluefinch_checkout_loqate_enabled,
          loqate: {
            enabled: !!+storeConfig.bluefinch_checkout_loqate_enabled,
            apiKey: storeConfig.bluefinch_checkout_loqate_api_key,
          },
          afd: {
            enabled: storeConfig.bluefinch_checkout_afd_enable,
          },
        },
        clickCollectTabsEnabled: storeConfig.bluefinch_checkout_click_collect_tabs_enabled,
      });

      if (storeConfig.locale) {
        this.setLocale(storeConfig.locale);
      }

      countries.sort((a, b) => a.full_name_locale.toUpperCase()
        .localeCompare(b.full_name_locale.toUpperCase()));

      this.setData({ countries });

      const customConfigs = await mapCustomConfigs(storeConfig);

      this.setData({
        custom: customConfigs,
      });
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
