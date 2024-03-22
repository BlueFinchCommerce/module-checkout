import { defineStore } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/GtmStore';
import useCartStore from '@/stores/CartStore';
import useStepsStore from '@/stores/StepsStore';

import cleanAddress from '@/helpers/cleanAddress';
import deepClone from '@/helpers/deepClone';
import doAddressesMatch from '@/helpers/doAddressesMatch';
import afterSubmittingShippingInformation from '@/helpers/afterSubmittingShippingInformation';
import getDummyShippingMethods from '@/helpers/dummyContent/getDummyShippingMethods';

import setShippingInformation from '@/services/setShippingInformation';
import getShipping from '@/services/getShippingMethods';
import getNominatedDates from '@/services/getNominatedShippingMethods';
import setClickAndCollectAgent from '@/services/setClickAndCollectAgent';
import updateAmastyClickCollectStores from '@/services/updateAmastyClickCollectStores';

export default defineStore('shippingMethodsStore', {
  state: () => ({
    shippingMethods: getDummyShippingMethods(),
    loadingShippingMethods: false,
    nominatedDayEnabled: false,
    nominatedDates: false,
    nominatedSelectedMethod: false,
    nominatedSelectedDate: false,
    nominatedSelectedDateFormatted: false,
    selectedMethod: getDummyShippingMethods()[0],
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

    /**
     * Load shipping methods based on address
     * @param {*} address
     */
    async getShippingMethods() {
      this.loadingShippingMethods = true;

      const customerStore = useCustomerStore();

      await this.getNominatedDeliveryMethods(customerStore.selected.shipping.postcode);
      const clonedAddress = cleanAddress({ ...customerStore.selected.shipping });

      // Check the address is valid
      const isValid = customerStore.validateAddress('shipping') && customerStore.validatePostcode('shipping');

      // If the address is invalid then show the address form.
      if (!isValid) {
        this.loadingShippingMethods = false;

        // Go to the details page if the shipping address isn't valid at this point.
        const stepsStore = useStepsStore();
        stepsStore.goToYouDetails();
        return;
      }

      const shippingMethods = await this.getCachedResponse(
        getShipping,
        'getShippingMethods',
        clonedAddress,
      );
      this.setShippingMethods(shippingMethods);

      // Check the cart selected method is still returned in the shipping methods
      let isMethodAvailable = false;
      if (this.selectedMethod.carrier_code) {
        isMethodAvailable = shippingMethods.find(
          (method) => method.method_code === this.selectedMethod.method_code,
        );
      }

      // Check if selected shipping = nominated_delivery method that comes from admin (not from matrix)
      // if so then unselect nominated_delivery method and select first shipping method in the list
      // done to prevent situation where there is no selected method on shipping step

      if (this.selectedMethod.carrier_code === 'nominated_delivery') {
        const shippingMethodsSliced = shippingMethods.slice(0, -1);
        const cheapestFromSliced = shippingMethodsSliced.reduce((prev, curr) => (
          prev.price_incl_tax < curr.price_incl_tax ? prev : curr
        ), {});
        this.selectShippingMethod(cheapestFromSliced);
      }

      // If there is no current selected method then select the cheapest by default.
      if (shippingMethods.length && (!isMethodAvailable || !this.selectedMethod.carrier_code)) {
        const cheapest = shippingMethods.reduce((prev, curr) => (
          prev.price_incl_tax < curr.price_incl_tax ? prev : curr
        ), {});

        // Check if cheapest shipping method = nominated_delivery method that comes from admin (not from matrix)
        // if so then unselect nominated_delivery method and select first shipping method in the list
        // done to prevent situation where there is no selected method on shipping step

        if (cheapest.carrier_code === 'nominated_delivery'
            || cheapest.carrier_code === 'amstorepickup') {
          const shippingMethodsSliced = shippingMethods.slice(0, -1);
          const cheapestFromSliced = shippingMethodsSliced.reduce((prev, curr) => (
            prev.price_incl_tax < curr.price_incl_tax ? prev : curr
          ), {});
          this.selectShippingMethod(cheapestFromSliced);
        } else {
          this.selectShippingMethod(cheapest);
        }

        await this.submitShippingInfo();
      }

      this.loadingShippingMethods = false;
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
      if (!this.selectedMethod.carrier_code
        && data.extension_attributes.shipping_assignments.length) {
        const [{ shipping }] = data.extension_attributes.shipping_assignments;

        // Set const for shipping method easier to pass around.
        const { method: shippingMethod, address } = shipping;

        if (shippingMethod) {
          // Set Character which is splitting the values
          const char = '_';
          // Check if how many char's we have.
          const count = [...shippingMethod].filter((x) => x === char).length;
          let methodArray = [];

          // If we have more than one we know this is a delivery method with two words
          // i.e delivery_method_delivery_method.
          if (count > 1) {
            const methodItems = shippingMethod.split('_');
            const firstUnderscore = methodItems.slice(0, -2);
            const secondUnderscore = methodItems.slice(-2);

            methodArray = [
              firstUnderscore.join('_'),
              secondUnderscore.join('_'),
            ];
          } else {
            methodArray = shippingMethod ? shippingMethod.split('_') : [];
          }

          const [carrierCode, methodCode] = methodArray;

          if (carrierCode && methodCode) {
            this.selectShippingMethod({
              carrier_code: carrierCode,
              method_code: methodCode,
            });
          }

          // If the method code contains click and collect then set the store to show it as click and collect.
          if (carrierCode === 'collect') {
            this.setData({
              isClickAndCollect: true,
            });
          }
        }

        const customerStore = useCustomerStore();

        // Set the shipping address if nothing in store exists.
        if (address.firstname && address.lastname) {
          if (!customerStore.$state.selected.shipping.id) {
            customerStore.setAddress(address, 'shipping');
            customerStore.setEditing('shipping', false);
          }
        }

        // Set the billing from data if nothing in store exists.
        const { billing_address: billingAddress } = data;
        if (billingAddress.firstname && billingAddress.lastname) {
          if (!customerStore.$state.selected.billing.id) {
            customerStore.setAddress(data.billing_address, 'billing');
          }
        }

        // If the addresses have different IDs they must be different so set billing to custom.
        if (!doAddressesMatch(address, billingAddress)) {
          customerStore.setAddressAsCustom('billing');
          customerStore.setData({
            selected: {
              billing: {
                same_as_shipping: false,
              },
            },
          });
        }

        // Set the customers email address from the shipping data if it doesn't already exist.
        if (address.email && !customerStore.$state.customer.email) {
          customerStore.setData({
            customer: {
              email: address.email,
            },
          });
        }
      }
    },

    /**
     * Submit shipping info to magento
     * @returns
     */
    async submitShippingInfo() {
      const customerStore = useCustomerStore();
      const cartStore = useCartStore();
      const clonedShipping = cleanAddress({ ...customerStore.selected.shipping });
      const clonedBilling = cleanAddress({ ...customerStore.selected.billing });

      this.loadingShippingMethods = true;

      const { totals } = await this.getCachedResponse(
        setShippingInformation,
        'submitShippingInfo',
        {
          shippingAddress: clonedShipping,
          billingAddress: clonedBilling,
          carrierCode: this.selectedMethod.carrier_code,
          methodCode: this.selectedMethod.method_code,
        },
      );
      cartStore.updateTotals(totals);
      cartStore.setData({
        cache: {
          getCartTotals: totals,
        },
      });

      // Allow custom behaviour after setting the shipping information.
      await afterSubmittingShippingInformation();

      this.loadingShippingMethods = false;

      return totals;
    },

    async setAsClickAndCollect(agentId) {
      this.loadingShippingMethods = true;
      await setClickAndCollectAgent(agentId);
      this.loadingShippingMethods = false;
    },

    setShippingMethodTitle() {
      const cartStore = useCartStore();
      const { totalSegments } = cartStore;
      const shippingIndex = totalSegments.findIndex((segment) => segment.code === 'shipping');

      // Early return if we have no found index for the shipping method.
      if (shippingIndex === -1) {
        return;
      }

      if (this.selectedMethod.method_title) {
        // Get the part of the shipping title between the first set of () if it exists.
        // Default to the whole title if it doesn't.
        const matchingShippingTitle = totalSegments[shippingIndex].title.match(/\(([^]+)\)/);
        const formattedShippingTitle = matchingShippingTitle
          ? matchingShippingTitle[1]
          : totalSegments[shippingIndex].title;

        // If the selected method is nominated day we need to format it slightly differently.
        const title = this.selectedMethod.method_code === 'nominated_delivery'
          ? `${this.nominatedSelectedDateFormatted}`
          : formattedShippingTitle;

        this.selectShippingMethod({ method_title: title });
      } else {
        const title = totalSegments[shippingIndex].title
          .replace(/\([^)].+ - */g, '(');
        this.selectShippingMethod({ method_title: title });
      }
    },

    /**
     * Set the method to click and collect.
     */
    async setClickAndCollect() {
      // Only need to do this if we aren't on click and collect already.
      if (!this.isClickAndCollect) {
        const customerStore = useCustomerStore();

        customerStore.createNewAddress('billing');
        await customerStore.getCustomerInformation();
        customerStore.createNewAddress('shipping');

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

        this.$state.selectedMethod = {};
        await this.setAsClickAndCollect('');

        customerStore.createNewAddress('shipping');
        customerStore.createNewAddress('billing');
        await customerStore.getCustomerInformation();

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
