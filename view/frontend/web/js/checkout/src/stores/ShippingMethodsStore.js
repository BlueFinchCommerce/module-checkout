import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useCartStore from '@/stores/CartStore';
import useLoadingStore from '@/stores/LoadingStore';

import deepClone from '@/helpers/addresses/deepClone';
import afterSubmittingShippingInformation from '@/helpers/addresses/afterSubmittingShippingInformation';
import setShippingMethodDataLayer from '@/helpers/dataLayer/setShippingMethodDataLayer';

import setShippingMethodOnCart from '@/services/addresses/setShippingMethodOnCart';
import getNominatedDates from '@/services/shipping/getNominatedShippingMethods';
import setClickAndCollectAgent from '@/services/shipping/setClickAndCollectAgent';
import updateAmastyClickCollectStores from '@/services/shipping/updateAmastyClickCollectStores';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default defineStore('shippingMethodsStore', {
  state: () => ({
    shippingMethods: [],
    nominatedDayEnabled: false,
    nominatedDates: false,
    nominatedSelectedMethod: false,
    nominatedSelectedDate: false,
    nominatedSelectedDateFormatted: false,
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

      // Check if we have shipping methods but not one selected.
      if (!cartStore.cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code
        && cartStore.cart.shipping_addresses?.[0]?.available_shipping_methods?.length) {
        const shippingMethod = cartStore.cart.shipping_addresses[0].available_shipping_methods[0];
        this.submitShippingInfo(shippingMethod.carrier_code, shippingMethod.method_code);
      }
    },

    /**
     * Get Nominated Delivery Methods
     */
    async getNominatedDeliveryMethods(postcode) {
      this.nominatedDates = false;

      try {
        const nominatedDates = await this.getCachedResponse(
          getNominatedDates,
          'getNominatedDeliveryMethods',
          postcode,
        );

        if (nominatedDates) {
          // Check dates are not empty
          if (Object.keys(nominatedDates) < 1) {
            this.nominatedDayEnabled = false;
            return;
          }

          this.nominatedDates = nominatedDates;
          this.nominatedDayEnabled = true;
        }
      } catch {
        //
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

      const response = await setAddressesOnCart(customerStore.selected.shipping, customerStore.selected.billing);

      cartStore.handleCartData(response.cart);
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
      this.clearCaches(['getNominatedDeliveryMethods', 'getShippingMethods']);
      this.clearSubmitShippingInfoCache();
    },

    clearSubmitShippingInfoCache() {
      this.clearCaches(['submitShippingInfo']);
    },
  },
});
