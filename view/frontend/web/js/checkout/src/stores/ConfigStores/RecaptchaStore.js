import { defineStore } from 'pinia';

import recapchaTypes from '@/helpers/types/getRecaptchaTypes';

export default defineStore('RecaptchaStore', {
  state: () => ({
    v2CheckboxKey: null,
    v2InvisibleKey: null,
    v3Invisible: null,
    enabled: {
      customerLogin: false,
      placeOrder: false,
    },
    tokens: {},
    cache: {},
  }),
  getters: {
    getTypeByPlacement: (state) => (
      (placement) => state.enabled[placement]
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    getInitialConfigValues() {
      return `
        storeConfig {
          recaptcha_v2_checkbox_key
          recaptcha_v2_invisible_key
          recaptcha_v3_invisible_key
          recaptcha_customer_login
          recaptcha_place_order
        }
      `;
    },

    handleInitialConfig({ storeConfig }) {
      console.log(storeConfig);
      this.setData({
        v2CheckboxKey: storeConfig.recaptcha_v2_checkbox_key,
        v2InvisibleKey: storeConfig.recaptcha_v2_invisible_key,
        v3Invisible: storeConfig.recaptcha_v3_invisible_key,
        enabled: {
          customerLogin: storeConfig.recaptcha_customer_login,
          placeOrder: storeConfig.recaptcha_place_order,
        },
      });
    },

    async addRecaptchaJs(type) {
      // Wrap in a cache so that the JS is injected only once but can be used to ensure it has definitely loaded.
      await this.getCachedResponse(() => new Promise((resolve) => {
        window.geneCheckoutRecaptchaLoaded = resolve;

        const render = type === recapchaTypes.recaptchaV3
          ? this.v3Invisible
          : 'explicit';
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=geneCheckoutRecaptchaLoaded&render=${render}`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);
      }), 'addRecaptchaJs');
    },

    setToken(id, token) {
      this.setData({
        tokens: {
          [id]: token,
        },
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
