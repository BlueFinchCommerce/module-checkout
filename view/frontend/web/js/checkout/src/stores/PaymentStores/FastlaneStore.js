import { defineStore } from 'pinia';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCustomerStore from '@/stores/CustomerStore';

export default defineStore('fastlaneStore', {
  state: () => ({
    cache: {
      clientInstance: null,
      dataCollectorInstance: null,
      fastlaneInstance: null,
    },
  }),
  getters: {},
  actions: {
    setData(data) {
      this.$patch(data);
    },

    buildJsPromises() {
      const files = [
        'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/client.min.js',
        'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/data-collector.min.js',
        'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/fastlane.min.js',
      ];
      const promises = [];

      files.forEach((file) => {
        const promise = new Promise((resolve) => {
          const googlePayScript = document.createElement('script');
          googlePayScript.setAttribute('src', file);
          googlePayScript.onload = resolve;
          document.head.appendChild(googlePayScript);
        });
        promises.push(promise);
      });

      return Promise.all(promises);
    },

    addRequiredJs() {
      return this.getCachedResponse(this.buildJsPromises, 'addRequiredJs');
    },

    async setup() {
      await this.addRequiredJs();
      window.localStorage.setItem('axoEnv', 'sandbox');
      const braintreeStore = useBraintreeStore();

      await braintreeStore.createClientToken();
      const { clientToken } = braintreeStore;

      const clientInstance = await window.braintree.client.create({
        authorization: clientToken,
      });
      this.setData({ clientInstance });

      const dataCollectorInstance = await window.braintree.dataCollector.create({
        client: clientInstance,
      });
      this.setData({ dataCollectorInstance });

      const fastlaneInstance = await window.braintree.fastlane.create({
        authorization: clientToken,
        client: clientInstance,
        deviceData: dataCollectorInstance.deviceData,
      });
      this.setData({ fastlaneInstance });
    },

    attachEmailListener() {
      const customerStore = useCustomerStore();

      customerStore.$subscribe(async (mutation) => {
        if (mutation.payload?.customer?.email) {
          const { customerContextId } = await this.$state.fastlaneInstance.identity.lookupCustomerByEmail(mutation.payload.customer.email);

          // If we have do have an account then trigger the authentication.
          if (customerContextId) {
            const { profileData } = await this.$state.fastlaneInstance.identity.triggerAuthenticationFlow(customerContextId);

            console.log(profileData);
          }
        }
      });
    },

    renderWatermark(selector) {
      if (this.$state.fastlaneInstance) {
        this.$state.fastlaneInstance.ConnectWatermarkComponent({
          includeAdditionalInfo: true,
        }).render(selector);
      }
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
