import { defineStore } from 'pinia';

import recapchaTypes from '@/helpers/types/getRecaptchaTypes';

export default defineStore('RecaptchaStore', {
  state: () => ({
    v2CheckboxKey: null,
    v2InvisibleKey: null,
    v3Invisible: null,
    failureMessage: '',
    enabled: {
      customerLogin: false,
      placeOrder: false,
    },
    tokens: {},
    errors: {},
    cache: {},
  }),
  getters: {
    getTypeByPlacement: (state) => (
      (placement) => state.enabled[placement]
    ),
    getRecaptchaError: (state) => (
      (placement) => state.errors[placement]
    ),
    isRecaptchaVisible: (state) => (
      (placement) => state.getTypeByPlacement(placement) === recapchaTypes.recaptchaV2
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
          validation_failure_message
        }
      `;
    },

    handleInitialConfig({ storeConfig }) {
      this.setData({
        v2CheckboxKey: storeConfig.recaptcha_v2_checkbox_key,
        v2InvisibleKey: storeConfig.recaptcha_v2_invisible_key,
        v3Invisible: storeConfig.recaptcha_v3_invisible_key,
        failureMessage: storeConfig.validation_failure_message,
        enabled: {
          customerLogin: storeConfig.recaptcha_customer_login,
          placeOrder: storeConfig.recaptcha_place_order,
        },
      });
    },

    async addRecaptchaJs(type) {
      // Wrap in a cache so that the JS is injected only once but can be used to ensure it has definitely loaded.
      await this.getCachedResponse(() => new Promise((resolve) => {
        window.bluefinchCheckoutRecaptchaLoaded = resolve;

        const render = type === recapchaTypes.recaptchaV3
          ? this.v3Invisible
          : 'explicit';
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=bluefinchCheckoutRecaptchaLoaded&render=${render}`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);
      }), 'addRecaptchaJs');
    },

    setToken(id, token) {
      this.setData({
        errors: {
          [id]: null,
        },
        tokens: {
          [id]: token,
        },
      });
    },

    resetToken(id) {
      this.setData({
        tokens: {
          [id]: null,
        },
      });
    },

    validateToken(id) {
      if (this.$state.enabled[id] && !this.$state.tokens[id]) {
        this.setData({
          errors: {
            [id]: this.$state.failureMessage,
          },
        });

        return false;
      }

      return true;
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
