import { defineStore } from 'pinia';

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
  }),

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
      if (attribute === 'street' && field !== 'street.1') {
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
  },
});
