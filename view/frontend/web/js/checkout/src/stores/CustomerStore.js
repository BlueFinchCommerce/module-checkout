import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getCustomerInformation from '@/services/customer/getCustomerInformation';
import isEmailAvailable from '@/services/customer/isEmailAvailable';
import login from '@/services/customer/login';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import amastyConsentLogic from '@/services/content/amastyConsentLogic';
import setGuestEmailOnCart from '@/services/cart/setGuestEmailOnCart';

import cleanAddress from '@/helpers/addresses/cleanAddress';
import deepClone from '@/helpers/addresses/deepClone';
import doAddressesMatch from '@/helpers/addresses/doAddressesMatch';
import formatAddress from '@/helpers/addresses/formatAddress';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getEmptyAddress from '@/helpers/addresses/getEmptyAddress';
import getLocalMaskedId from '@/helpers/cart/getLocalMaskedId';
import getUrlTokens from '@/helpers/tokens/getUrlTokens';
import tokenTypes from '@/helpers/tokens/getTokenTypes';

import functionExtension from '@/extensions/functionExtension';

export default defineStore('customerStore', {
  state: () => ({
    customer: { addresses: [], email: '', ...getUrlTokens },
    hasPreviouslyOrderedFpf: false,
    emailEntered: false,
    selected: {
      shipping: getEmptyAddress(),
      billing: getEmptyAddress(true),
      formErrors: {
        billing: [],
        shipping: [],
        message: {
          billing: false,
          shipping: false,
        },
      },
      regionRequired: {
        billing: {
          required: false,
          regionOptions: [],
        },
        shipping: {
          required: false,
          regionOptions: [],
        },
      },
    },
    newsletter: {
      subscribeToNewsletter: false,
      isSubscribed: false,
    },
    amastySubs: {},
    amastyConsentStatus: {},
    isEmailAvailableController: undefined,
    postCodeValid: false,
    cache: {},
    inputsSanitiseError: false,
  }),
  getters: {
    isLoggedIn: (state) => state.customer.tokenType === tokenTypes.authKey
        || state.customer.tokenType === tokenTypes.phpSessionId,
    getSelectedBillingAddress: (state) => (
      formatAddress(cleanAddress({ ...state.selected.billing }))
    ),
    getSelectedShippingAddress: (state) => (
      formatAddress(cleanAddress({ ...state.selected.shipping }))
    ),
    isUsingSavedShippingAddress: (state) => (
      state.customer.addresses.some((address) => address.id === state.selected.shipping.id)
    ),
    isUsingSavedBillingAddress: (state) => (
      state.customer.addresses.some((address) => address.id === state.selected.billing.id)
    ),
    getAddressFieldHasError: (state) => (
      (addressType, field) => (
        state.selected.formErrors[addressType].find((fieldError) => fieldError === field)
      )
    ),
    getRegionOptions: (state) => (
      (addressType) => state.selected.regionRequired[addressType].regionOptions
    ),
    getRegionRequired: (state) => (
      (addressType) => state.selected.regionRequired[addressType].required
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    setAddressToStore(address, addressType) {
      // Create new addess to be able to be changed.
      const clonedAddress = deepClone(address);

      // If the address has an object for country map it to the right value.
      if (typeof address.country === 'object') {
        clonedAddress.country_code = address.country.code;
        delete clonedAddress.country;
      }

      // The region comes back with different keys than it expects so map them.
      if (Object.keys(address).length !== 0 && address.region.label) {
        const configStore = useConfigStore();
        clonedAddress.region.region = address.region.code;
        clonedAddress.region.region_id = configStore.getRegionId(address.country.code, address.region.code);
        delete clonedAddress.region.label;
      }

      // Save the address to state and also include the email address from the customer.
      this.setData({
        selected: {
          [addressType]: Object.assign(clonedAddress, { email: this.customer.email }),
        },
      });

      if (addressType === 'shipping') {
        const shippingMethodsStore = useShippingMethodsStore();

        // If we're setting the shipping but billing is the same then set it to match.
        if (this.selected.billing.same_as_shipping && !shippingMethodsStore.isClickAndCollect) {
          this.setData({
            selected: {
              billing: Object.assign(clonedAddress, { email: this.customer.email }),
            },
          });
        }
      }
    },

    setSelectedSavedAddress(addressType, value) {
      this.setData({
        selected: {
          [addressType]: {
            isSavedAddressSelected: value,
          },
        },
      });
    },

    setAddressAsEditing(addressType, value) {
      this.setData({
        selected: {
          [addressType]: {
            editing: value,
          },
        },
      });
    },

    setAddressAsCustom(addressType) {
      this.setData({
        selected: {
          [addressType]: {
            id: 'custom',
          },
        },
      });

      if (addressType === 'billing') {
        this.setData({
          selected: {
            billing: {
              same_as_shipping: false,
            },
          },
        });
      }
    },

    clearRegion(addressType) {
      this.setData({
        selected: {
          [addressType]: {
            region: {
              region: '',
              region_code: '',
              region_id: 0,
            },
          },
          regionRequired: {
            [addressType]: {
              required: false,
              regionOptions: [],
            },
          },
        },
      });
    },

    updateRegionRequired(addressType) {
      const { stateRequired } = useConfigStore();
      const currentCountry = this.selected[addressType].country_code;

      if (stateRequired.indexOf(currentCountry) !== -1) {
        const { countries } = useConfigStore();
        const country = countries.find((cty) => cty.id === currentCountry);

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
          this.setData({
            selected: {
              regionRequired: {
                [addressType]: {
                  required: true,
                  regionOptions,
                },
              },
            },
          });
        }
      }
    },

    isEmailAvailable(email) {
      // Cancel the previous request if it exists.
      if (this.$state.isEmailAvailableController) {
        this.$state.isEmailAvailableController.abort();
      }

      const controller = new AbortController();

      this.setData({
        isEmailAvailableController: controller,
      });

      return isEmailAvailable(email, controller);
    },

    setEmailAddress(email) {
      this.setData({
        customer: {
          email,
        },
      });
    },

    async login(email, pass) {
      const data = await login(email, pass);
      const cartStore = useCartStore();

      // Clear maskedId.
      cartStore.setData({
        maskedId: null,
      });

      refreshCustomerData(['customer'].concat(getCartSectionNames()));
      this.setData({
        customer: {
          email,
          tokenType: tokenTypes.phpSessionId,
        },
      });
      cartStore.clearAllCaches();
      cartStore.clearCartItems('all');
      await cartStore.getCart();

      this.clearCaches(['getCustomerInformation']);
      await this.getCustomerInformation();

      await functionExtension('onLogin');

      return data;
    },

    async getCustomerInformation() {
      if (this.customer.tokenType !== tokenTypes.guestUser) {
        const data = await this.getCachedResponse(getCustomerInformation, 'getCustomerInformation');

        if (data) {
          this.setData({
            customer: {
              ...data,
              id: this.customer.firstname,
            },
          });
          this.setEmailEntered();
          // If we have a matched shipping address then set it so it doesn't show as custom.
          const matchedShipping = data.addresses.findIndex((address) => (
            doAddressesMatch(address, this.selected.shipping)
          ));
          if (matchedShipping !== -1) {
            this.setAddressToStore(data.addresses[matchedShipping], 'shipping');
          }

          // If we have a matched billing address then set it so it doesn't show as custom.
          const matchedBilling = data.addresses.findIndex((address) => (
            doAddressesMatch(address, this.selected.billing)
          ));
          if (matchedBilling !== -1) {
            this.setAddressToStore(data.addresses[matchedBilling], 'billing');
          }

          // Default to the customers default addresses if nothing exists.
          if (!this.selected.shipping.id && !this.selected.shipping.firstname) {
            const defaultShipping = this.getDefaultAddress(data, 'default_shipping');
            defaultShipping && this.setAddressToStore(defaultShipping, 'shipping');
          }
          if (!this.selected.billing.id && !this.selected.billing.firstname) {
            const defaultBilling = this.getDefaultAddress(data, 'default_billing');
            defaultBilling && this.setAddressToStore(defaultBilling, 'billing');
          }

          // If at this point we still haven't got a shipping address then set it to editing to show the new form.
          if (!this.selected.shipping.id) {
            this.setAddressAsEditing('shipping', true);
          }

          // Set if the billing address is custom based on whether it matches the shipping address.
          if (!doAddressesMatch(this.selected.billing, this.selected.shipping)) {
            this.setAddressAsCustom('billing');
          }

          // Update the newsletter subscription status.
          this.setData({
            newsletter: {
              isSubscribed: data.is_subscribed || false,
            },
          });
        }
        if (this.customer.tokenType !== tokenTypes.authKey) {
          const tokenType = data ? tokenTypes.phpSessionId : tokenTypes.guestUser;
          this.setData({
            customer: {
              tokenType,
            },
          });
        }

        return data;
      }

      // Set if the billing address is custom based on whether it matches the shipping address.
      if (!doAddressesMatch(this.selected.billing, this.selected.shipping)) {
        this.setAddressAsCustom('billing');
      }

      return null;
    },

    checkForGuestUser() {
      const maskedId = getLocalMaskedId();
      if (maskedId) {
        this.setMaskedId(maskedId);
      }
    },

    setMaskedId(maskedId) {
      this.setData({
        customer: {
          token: maskedId,
          tokenType: tokenTypes.guestUser,
        },
      });
    },

    async submitEmail(email) {
      if (this.customer.tokenType === tokenTypes.guestUser) {
        await setGuestEmailOnCart(email);
      }
    },

    setEmailEntered() {
      this.setData({ emailEntered: true });
    },

    editEmail() {
      this.setData({ emailEntered: false });
    },

    createNewAddress(addressType) {
      const sameAsShipping = addressType === 'billing';
      this.setData({
        selected: {
          [addressType]: getEmptyAddress(sameAsShipping),
        },
      });
    },

    createNewBillingAddress(addressType) {
      this.setData({
        selected: {
          [addressType]: getEmptyAddress(false),
        },
      });
    },

    // Set the errors
    setAddressErrorMessage(addressType) {
      const address = this.selected.formErrors[addressType];
      if (address.length) {
        const message = `The following fields are missing from your ${addressType} address: ${
          address.join(', ').toString()}`;
        this.setData({
          selected: {
            formErrors: {
              message: {
                [addressType]: message,
              },
            },
          },
        });
      }
    },

    getDefaultAddress(data, addressType) {
      const foundAddress = data.addresses.find((address) => (
        typeof address[addressType] !== 'undefined' && address[addressType]
      ));

      return foundAddress
        ? Object.assign(foundAddress, { editing: false })
        : {};
    },

    updateNewsletterSubscription(state) {
      this.setData({
        newsletter: {
          subscribeToNewsletter: state,
        },
      });
    },

    updateAmastySubscription(state) {
      this.setData({
        amastySubs: state,
      });
    },

    async getAmastyConsentStatus(email) {
      const status = await amastyConsentLogic(email);
      this.setData({
        amastyConsentStatus: status,
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
  },
});
