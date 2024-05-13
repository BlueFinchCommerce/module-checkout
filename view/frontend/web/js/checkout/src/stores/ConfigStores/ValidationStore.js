import { defineStore } from 'pinia';

import requiredValid from '@/helpers/validation/requiredValid';
import minLength from '@/helpers/validation/minLength';
import maxLength from '@/helpers/validation/maxLength';
import getPhoneValidation from '@/helpers/addresses/getPhoneValidation';

/**
 * Validation store
 */

export default defineStore('ValidationStore', {
  state: () => ({
    validationMapping: {
      IS_REQUIRED: requiredValid,
      MIN_TEXT_LENGTH: minLength,
      MAX_TEXT_LENGTH: maxLength,
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

    isRequired(attribute) {
      const validationRules = this.validationItems?.[attribute]?.items[0]?.validate_rules;

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

    testValidationRules(value, attribute) {
      const validationRules = this.validationItems?.[attribute]?.items[0]?.validate_rules;

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
        if (attribute === 'telephone') {
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
