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
      braintree: false,
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
          recaptcha_braintree
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
          braintree: storeConfig.recaptcha_braintree,
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

    async validateToken(ids, location = 'braintreeNewMethods') {
      const placementIds = Array.isArray(ids) ? ids : [ids];
      const id = placementIds.find(this.getTypeByPlacement);
      const recapchaType = this.getTypeByPlacement(id);

      if (recapchaType === recapchaTypes.invisible) {
        await new Promise((resolve) => {
          const recaptchaId = window.grecaptcha.render(location, {
            sitekey: this.$state.v2InvisibleKey,
            size: 'invisible',
            callback: (token) => {
              this.setToken(id, token);
              resolve();
            },
            'error-callback': () => {
              this.setToken(id, null);
              window.grecaptcha.reset(recaptchaId);
            },
            'expired-callback': () => {
              this.setToken(id, null);
              window.grecaptcha.reset(recaptchaId);
            },
          });
          window.grecaptcha.execute();
        });
      } else if (recapchaType === recapchaTypes.recaptchaV3) {
        const token = await window.grecaptcha.execute(this.$state.v3Invisible, { action: 'submit' });
        this.setToken(id, token);
      }

      if (this.$state.enabled[id] && !this.$state.tokens[id]) {
        this.setData({
          errors: {
            [id]: this.$state.failureMessage,
          },
        });

        return false;
      }

      console.log('pass');
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
