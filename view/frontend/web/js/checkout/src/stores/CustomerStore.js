import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getCustomerInformation from '@/services/getCustomerInformation';
import getCustomerRewardPoints from '@/services/getCustomerRewardPoints';
import getCustomerStoreCredit from '@/services/storeCredit/getCustomerStoreCredit';
import isEmailAvailable from '@/services/isEmailAvailable';
import login from '@/services/login';
import refreshCustomerData from '@/services/refreshCustomerData';
import amastyConsentLogic from '@/services/amastyConsentLogic';
import setGuestEmailOnCart from '@/services/cart/setGuestEmailOnCart';

import cleanAddress from '@/helpers/cleanAddress';
import doAddressesMatch from '@/helpers/doAddressesMatch';
import formatAddress from '@/helpers/formatAddress';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getEmptyAddress from '@/helpers/getEmptyAddress';
import getMaskedId from '@/helpers/getMaskedId';
import getPhoneValidation from '@/helpers/getPhoneValidation';
import getUrlTokens from '@/helpers/getUrlTokens';
import tokenTypes from '@/helpers/getTokenTypes';

import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';

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
    loadingCustomerInformation: false,
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
      if (addressType === 'shipping') {
        const shippingMethodsStore = useShippingMethodsStore();

        // If we're setting the shipping but billing is the same then set it to match.
        if (this.selected.billing.same_as_shipping && !shippingMethodsStore.isClickAndCollect) {
          this.setData({
            selected: {
              billing: Object.assign(address, { email: this.customer.email }),
            },
          });
        }
      }

      // Save the address to state and also include the email address from the customer.
      this.setData({
        selected: {
          [addressType]: Object.assign(address, { email: this.customer.email }),
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

    updateRegionRequired(addressType) {
      const { stateRequired } = useConfigStore();
      const currentCountry = this.selected[addressType].country_code;

      this.setData({
        selected: {
          regionRequired: {
            [addressType]: {
              required: false,
              regionOptions: [],
            },
          },
        },
      });

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

    addAddressError(addressType, error) {
      const errors = this.selected.formErrors[addressType];
      const index = errors.indexOf(error);

      // Only add this new error if it's not already in the list.
      if (index === -1) {
        errors.push(error);
        this.setData({
          selected: {
            formErrors: {
              [addressType]: errors,
            },
          },
        });
      }
    },

    removeAddressError(addressType, error) {
      const errors = this.selected.formErrors[addressType];
      const index = errors.indexOf(error);
      if (index !== -1) {
        errors.splice(index, 1);
        this.setData({
          selected: {
            formErrors: {
              [addressType]: errors,
            },
          },
        });
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

      await refreshCustomerData(['customer'].concat(getCartSectionNames()));
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

      return data;
    },

    async getCustomerInformation() {
      if (this.customer.tokenType !== tokenTypes.guestUser) {
        this.setData({
          loadingCustomerInformation: true,
        });
        const data = await this.getCachedResponse(getCustomerInformation, 'getCustomerInformation');
        if (data) {
          this.setData({
            customer: {
              addresses: data.addresses,
              id: data.firstname,
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

        this.setData({
          loadingCustomerInformation: false,
        });
        return data;
      }

      // Set if the billing address is custom based on whether it matches the shipping address.
      if (!doAddressesMatch(this.selected.billing, this.selected.shipping)) {
        this.setAddressAsCustom('billing');
      }

      return null;
    },

    checkForGuestUser() {
      const maskedId = getMaskedId();
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
        const cart = await setGuestEmailOnCart(email);

        const cartStore = useCartStore();
        cartStore.handleCartData(cart);
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

    /**
      * Validate Email Forms
      * @todo - this is a naff. It would be much better to handle this differently
      * @param {*} addressType
      * @returns
      */
    validateAddress(addressType, addErrors = false) {
      const requiredFields = {
        street: 'Address Line 1',
        city: 'City',
        country_code: 'Country',
        region: 'State/Region',
      };

      let valid = true;
      const streetAddress1 = this.selected[addressType].street[0];
      const streetAddress2 = this.selected[addressType].street[1];
      const streetAddressLength = [streetAddress1, streetAddress2].join(' ').length;

      Object.entries(requiredFields).forEach(([key, value]) => {
        addErrors && this.removeAddressError(addressType, value);

        // Handle Street a little differently
        if (key === 'street') {
          if (!this.selected[addressType].street[0].trim() || streetAddressLength > 75) {
            addErrors && this.addAddressError(addressType, value);
            valid = false;
          }
        }

        // Additional check on the trimmed string required to ensure user does not submit only empty
        // spaces ie Submitting " " instead of "" will bypass the native html validation
        // and we'd get no data :(
        if (key === 'region') {
          if (this.selected.regionRequired[addressType].required) {
            if (
              !this.selected[addressType][key]
              || (typeof this.selected[addressType][key] === 'string'
              && !this.selected[addressType][key].trim())
            ) {
              addErrors && this.addAddressError(addressType, value);
              valid = false;
            }
          }
        } else if (
          !this.selected[addressType][key]
            || (typeof this.selected[addressType][key] === 'string'
            && !this.selected[addressType][key].trim())
        ) {
          addErrors && this.addAddressError(addressType, value);
          valid = false;
        }
      });
      // Set the message
      if (!valid) {
        addErrors && this.setAddressErrorMessage(addressType);
      }

      return valid;
    },

    validatePostcode(addressType, addErrors = false) {
      const configStore = useConfigStore();

      addErrors && this.removeAddressError(addressType, 'Country');
      addErrors && this.removeAddressError(addressType, 'Postcode');

      let isValid = true;

      if (configStore.postcodeRequired(this.selected[addressType].country_code)) {
        if (!this.selected[addressType].country_code) {
          addErrors && this.addAddressError(addressType, 'Country');
        } else {
          const countId = this.selected[addressType].country_code;
          const postCode = this.selected[addressType].postcode;
          if (postcodeValidatorExistsForCountry(countId)) {
            isValid = postcodeValidator(postCode, countId);
          } else {
            isValid = true;
          }

          this.setData({
            postCodeValid: isValid,
          });

          !isValid && addErrors && this.addAddressError(addressType, 'Postcode');
        }
      }

      this.setData({
        postCodeValid: isValid,
      });

      return isValid;
    },

    validateNameField(addressType, fieldName, value, addErrors = false) {
      const invalid = !value || (typeof value === 'string' && !value.trim());
      if (invalid) {
        addErrors && this.addAddressError(addressType, fieldName);
      } else {
        this.removeAddressError(addressType, fieldName);
      }
      return !invalid;
    },

    validatePhone(addressType, phone, addErrors = false) {
      /* eslint-disable  no-useless-escape */
      const isValid = getPhoneValidation(phone);
      if (!isValid) {
        addErrors && this.addAddressError(addressType, 'Telephone');
      } else {
        this.removeAddressError(addressType, 'Telephone');
      }
      return isValid;
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

      // The region can sometime be an object based on config so handle that.
      if (foundAddress) {
        const { region } = foundAddress;
        foundAddress.region = region.region ? region.region : region;
      }

      return foundAddress
        ? Object.assign(foundAddress, { editing: false })
        : {};
    },

    async getAvailableRewardPoints() {
      const response = await getCustomerRewardPoints();

      if (response.customer) {
        this.setData(response);
      }
    },

    async getAvailableStoreCredit() {
      const response = await getCustomerStoreCredit();

      if (response.customer) {
        this.setData(response);
      }
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
