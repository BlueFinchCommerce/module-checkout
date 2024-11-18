define([
  'jquery'
], function ($) {
  'use strict';
  return function (target) {
    $.validator.addMethod(
      'validate-cdn-field',
      function (value) {
        // Trim the value to ignore leading or trailing whitespace
        value = value.trim();
    
        // Regex to validate properly closed HTML tags, allowing multiline content
        const htmlTagRegex = /<([a-z]+)([^>]*)>([\s\S]*?)<\/\1>/;
    
        // Test if the value matches the regex
        return value === '' || htmlTagRegex.test(value);
      },
      $.mage.__('Please enter valid HTML.')
    );
    return target;
  };
});