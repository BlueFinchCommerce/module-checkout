import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useCartStore from '@/stores/CartStore';
import useLoadingStore from '@/stores/LoadingStore';

import deepClone from '@/helpers/addresses/deepClone';
import afterSubmittingShippingInformation from '@/helpers/addresses/afterSubmittingShippingInformation';
import setShippingMethodDataLayer from '@/helpers/dataLayer/setShippingMethodDataLayer';

import setShippingMethodOnCart from '@/services/addresses/setShippingMethodOnCart';
import setClickAndCollectAgent from '@/services/shipping/setClickAndCollectAgent';
import updateAmastyClickCollectStores from '@/services/shipping/updateAmastyClickCollectStores';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default defineStore('shippingMethodsStore', {
  state: () => ({
    shippingMethods: [],
    selectedMethod: {},
    cache: {},
    isClickAndCollect: false,
    clickAndCollectLocation: {},
    amastyClickAndCollectData: {},
    amastySelectedStore: null,
    amastyClickCollectUpdatedStores: {},
  }),
  getters: {
    getError: (state) => state.shippingMethods.filter((rate) => rate.error_message !== '')[0],
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    /**
     * Set Shipping Methods
     * @param {*} shippingMethods
     * @returns
     */
    setShippingMethods(shippingMethods) {
      this.setData({
        shippingMethods,
      });

      return shippingMethods;
    },

    async setDefaultShippingMethod() {
      const cartStore = useCartStore();

      const availableMethods = cartStore.cart.shipping_addresses?.[0]?.available_shipping_methods || [];
      const filteredMethods = availableMethods.filter(({ available }) => available);

      // Check if we have shipping methods but not one selected.
      if (filteredMethods?.length === 1) {
        if (!cartStore.cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code
          && availableMethods?.length) {
          const shippingMethod = filteredMethods[0];
          this.submitShippingInfo(shippingMethod.carrier_code, shippingMethod.method_code);
        }
      } else if (!cartStore.cart.shipping_addresses?.[0]?.selected_shipping_method?.length
          && filteredMethods?.length) {
        const shippingMethod = filteredMethods[0];
        this.submitShippingInfo(shippingMethod.carrier_code, shippingMethod.method_code);
      }
    },

    selectShippingMethod(item) {
      if (item.carrier_code
        && this.$state.selectedMethod.carrier_code
        && item.carrier_code !== this.$state.selectedMethod.carrier_code) {
        const gtmStore = useGtmStore();
        gtmStore.trackGtmEvent({
          event: 'checkoutOption',
          ecommerce: {
            checkout_option: {
              actionField: {
                step: 2,
                option: 'shipping',
              },
            },
          },
        });
      }
      const clonedMethod = deepClone(item);
      this.$patch({
        selectedMethod: clonedMethod,
      });
      this.clearSubmitShippingInfoCache();
    },

    setShippingDataFromCartData(data) {
      this.setData({
        shippingMethods: data.shipping_addresses?.[0].available_shipping_methods,
        selectedMethod: data.shipping_addresses?.[0].selected_shipping_method,
      });
    },

    async setAddressesOnCart() {
      const customerStore = useCustomerStore();
      const cartStore = useCartStore();
      const { setLoadingState } = useLoadingStore();

      setLoadingState(true);
      const response = await setAddressesOnCart(customerStore.selected.shipping, customerStore.selected.billing);

      cartStore.handleCartData(response.cart);

      setLoadingState(false);
    },

    async submitShippingInfo(carrierCode, methodCode) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      const cart = await setShippingMethodOnCart(carrierCode, methodCode);

      const cartStore = useCartStore();
      cartStore.handleCartData(cart);

      // Allow custom behaviour after setting the shipping information.
      await afterSubmittingShippingInformation();

      // Track this event.
      setShippingMethodDataLayer();

      setLoadingState(false);
    },

    async setAsClickAndCollect(agentId) {
      const { setLoadingState } = useLoadingStore();
      setLoadingState(true);

      await setClickAndCollectAgent(agentId);

      setLoadingState(false);
    },

    /**
     * Set the method to click and collect.
     */
    async setClickAndCollect() {
      // Only need to do this if we aren't on click and collect already.
      if (!this.isClickAndCollect) {
        const customerStore = useCustomerStore();

        customerStore.createNewAddress('shipping');
        customerStore.createNewAddress('billing');

        await customerStore.getCustomerInformation();
        customerStore.selected.billing.same_as_shipping = true;

        this.setData({
          isClickAndCollect: true,
        });
      }
    },

    /**
     * Set the method to non click and collect.
     */
    async setNotClickAndCollect() {
      // Only need to do this if we're on click and collect.
      if (this.isClickAndCollect) {
        const customerStore = useCustomerStore();
        const cartStore = useCartStore();

        await cartStore.getCart();

        this.$state.selectedMethod = {};
        await this.setAsClickAndCollect('');

        customerStore.createNewAddress('shipping');
        customerStore.createNewAddress('billing');

        await customerStore.getCustomerInformation();
        customerStore.selected.billing.same_as_shipping = true;

        this.setData({
          isClickAndCollect: false,
        });
      }
    },

    /**
     * Set the click and collect location to store.
     */
    setClickAndCollectLocation(location) {
      this.setData({
        clickAndCollectLocation: {
          ...location,
          lat: parseFloat(location.lat),
          long: parseFloat(location.long),
        },
      });
    },

    /**
     * Search thought all stores in Amasty click and collect shipping modal
     */
    async searchAmastyClickCollectStores(radius, lat, lng) {
      const response = await updateAmastyClickCollectStores(radius, lat, lng);
      const stores = response.items;
      this.setData({
        amastyClickCollectUpdatedStores: {
          stores,
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

    clearShippingMethodCache() {
      this.clearCaches(['getShippingMethods']);
      this.clearSubmitShippingInfoCache();
    },

    clearSubmitShippingInfoCache() {
      this.clearCaches(['submitShippingInfo']);
    },
  },
});
