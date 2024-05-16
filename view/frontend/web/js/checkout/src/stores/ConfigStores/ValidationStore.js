import { defineStore } from 'pinia';
import lodashGet from 'lodash.get';
import useCustomerStore from '@/stores/CustomerStore';

import requiredValid from '@/helpers/validation/requiredValid';
import minLength from '@/helpers/validation/minLength';
import maxLength from '@/helpers/validation/maxLength';
import inputTypeValid from '@/helpers/validation/inputTypeValid';
import getPhoneValidation from '@/helpers/addresses/getPhoneValidation';
import deepClone from '@/helpers/addresses/deepClone';

/**
 * Validation store
 */

export default defineStore('ValidationStore', {
  state: () => ({
    validationMapping: {
      IS_REQUIRED: requiredValid,
      MIN_TEXT_LENGTH: minLength,
      MAX_TEXT_LENGTH: maxLength,
      INPUT_VALIDATION: inputTypeValid,

    },
    attributes: [
      'prefix',
      'firstname',
      'middlename',
      'lastname',
      'suffix',
      'company',
      'street',
      'country_id',
      'region',
      'city',
      'postcode',
      'telephone',
      'fax',
      'vat_id',
    ],
    validationItems: {},
    errors: {
      billing: {},
      shipping: {},
    },
  }),

  getters: {
    isFieldValid: (state) => (
      (addressType, field) => typeof state.errors[addressType][field] === 'undefined'
    ),
    isAddressValid: (state) => (
      (addressType) => !Object.keys(state.errors[addressType]).length
    ),
  },

  actions: {
    setData(data) {
      this.$patch(data);
    },

    getInitialConfigValues() {
      return this.attributes.map((attribute) => (
        `${attribute}: customAttributeMetadata(
            attributes: [{ attribute_code: "${attribute}", entity_type: "customer_address" }]
          ) {
            items {
                attribute_code
                multiline_count
                validate_rules {
                  name
                  value
                }
            }
          }`
      ));
    },

    handleInitialConfig(data) {
      this.attributes.forEach((attribute) => {
        this.setData({
          validationItems: {
            [attribute]: data[attribute],
          },
        });
      });
    },

    getValidationRules(field) {
      const [attribute] = field.split('.');
      const validationRules = deepClone(this.validationItems?.[attribute]?.items[0]?.validate_rules);

      // Only street 1 is ever required.
      if (validationRules?.length && attribute === 'street' && field !== 'street.0') {
        const requiredIndex = validationRules.findIndex(({ name }) => name === 'IS_REQUIRED');
        if (requiredIndex !== -1) {
          validationRules.splice(requiredIndex, 1);
        }
      }

      return validationRules;
    },

    isRequired(attribute) {
      const validationRules = this.getValidationRules(attribute);

      if (validationRules) {
        // Find the IS_REQUIRED rule
        const isRequiredRule = validationRules.find((rule) => rule.name === 'IS_REQUIRED');
        if (isRequiredRule) {
          // If the value is "1", return true (required), otherwise return false
          return isRequiredRule.value === '1';
        }
        return false;
      }
      // If no validation rules are defined, field is not required
      return false;
    },

    /**
      * Validate Email Forms
      * @todo - this is a naff. It would be much better to handle this differently
      * @param {*} addressType
      * @returns
      */
    validateAddress(addressType, displayErrors = false) {
      const customerStore = useCustomerStore();

      let isValid = true;

      Object.entries(customerStore.selected[addressType]).forEach(([attribute, value]) => {
        if (!this.$state.attributes.includes(attribute)) {
          return;
        }

        if (attribute === 'region') {
          isValid = this.validateRegion(addressType, displayErrors);
        } else if (attribute === 'street') {
          Object.entries(value).forEach(([index]) => {
            const streetLine = `street.${parseInt(index, 10) + 1}`;
            const keyIsValid = this.validateField(addressType, streetLine, displayErrors);

            if (!keyIsValid) {
              isValid = false;
            }
          });
        } else {
          const keyIsValid = this.validateField(addressType, attribute, displayErrors);

          if (!keyIsValid) {
            isValid = false;
          }
        }
      });

      return isValid;
    },

    validateField(addressType, field, displayError) {
      const customerStore = useCustomerStore();
      const value = lodashGet(customerStore.selected[addressType], field);

      const isValid = this.testValidationRules(value, field);

      if (!isValid) {
        this.addAddressError(addressType, field, displayError);
      } else {
        this.removeAddressError(addressType, field);
      }

      return isValid;
    },

    validateRegion(addressType, displayError) {
      const customerStore = useCustomerStore();

      if (!customerStore.getRegionRequired(addressType)) {
        this.removeAddressError(addressType, 'region', displayError);
        return true;
      }

      const value = lodashGet(customerStore.selected[addressType], 'region.region')
        || lodashGet(customerStore.selected[addressType], 'region.region_id');

      const isValid = typeof value === 'string' && value.trim();

      isValid
        ? this.removeAddressError(addressType, 'region', displayError)
        : this.addAddressError(addressType, 'region', displayError);

      return isValid;
    },

    testValidationRules(value, field) {
      const validationRules = this.getValidationRules(field);

      if (validationRules) {
        // Use Array.every() to ensure that all validation rules pass
        const validationResults = validationRules.every((rule) => {
          const helperFunction = this.validationMapping[rule.name];
          if (helperFunction) {
            const validationResult = helperFunction(value, rule.value);

            return validationResult;
          }
          // If no helper function is found, assume the validation passes
          return true;
        });

        // If attribute is "telephone", also check phone validation
        if (field === 'telephone') {
          const phoneValidationResult = getPhoneValidation(value);
          return validationResults && phoneValidationResult;
        }

        return validationResults;
      }
      // If no validation rules are defined, consider the value valid
      return true;
    },

    addAddressError(addressType, error, displayError) {
      const errors = this.errors[addressType];
      errors[error] = displayError;

      this.setData({
        errors: {
          [addressType]: errors,
        },
      });
    },

    removeAddressError(addressType, error) {
      const errors = this.errors[addressType];
      delete errors[error];

      this.setData({
        errors: {
          [addressType]: errors,
        },
      });
    },
  },
});
