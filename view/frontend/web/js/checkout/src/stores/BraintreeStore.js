import { markRaw } from 'vue';
import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';

import getStoreConfig from '@/services/getStoreConfig';

import createClientToken from '@/services/braintree/createClientToken';
import getVaultedMethods from '@/services/braintree/getVaultedMethods';

export default defineStore('brainteeStore', {
  state: () => ({
    cache: {},
    environment: 'sandbox',
    merchantAccountId: '',
    clientToken: null,
    clientInstance: null,
    threeDSecureInstance: null,
    vaultActive: false,
    vaultedMethods: {},
    vaultVerifyCvv: false,
    threeDSThresholdAmount: 0,
    threeDSEnabled: false,
    alwaysRequestThreeDS: false,
    errorMessage: null,
    google: {
      buttonColor: 'white',
      cCTypes: [],
      merchantId: '',
      vaultActive: false,
    },
    lpm: {
      allowedMethods: [],
      fallbackText: '',
      redirectOnFail: '',
    },
    paypal: {
      merchantNameOverride: null,
      merchantCountry: '',
      requireBillingAddress: false,
      sendCartLineItems: false,
      buttonLabel: '',
      buttonColor: '',
      buttonShape: '',
      vaultActive: false,
    },
  }),
  getters: {
    selectedVaultMethod: (state) => (
      Object.values(state.vaultedMethods).find(({ selected }) => selected)
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    async getConfig(configs) {
      const cacheKey = this.createCacheKey(configs);

      const data = await this.getCachedResponse(getStoreConfig, cacheKey, configs);

      this.$patch({
        cache: {
          [cacheKey]: data,
        },
      });
      return data;
    },

    async getBraintreeConfig() {
      const configs = [
        'braintree_environment',
        'braintree_merchant_account_id',
        'braintree_cc_vault_active',
        'braintree_cc_vault_cvv',
        'braintree_3dsecure_threshold_amount',
        'braintree_3dsecure_verify_3dsecure',
        'braintree_3dsecure_always_request_3ds',
        'braintree_googlepay_merchant_id',
        'braintree_googlepay_cctypes',
        'braintree_googlepay_btn_color',
        'braintree_googlepay_vault_active',
        'braintree_paypal_merchant_name_override',
        'braintree_paypal_merchant_country',
        'braintree_paypal_require_billing_address',
        'braintree_paypal_send_cart_line_items',
        'braintree_paypal_button_location_checkout_type_paypal_label',
        'braintree_paypal_button_location_checkout_type_paypal_color',
        'braintree_paypal_button_location_checkout_type_paypal_shape',
        'braintree_paypal_vault_active',
        'braintree_local_payment_fallback_button_text',
        'braintree_local_payment_redirect_on_fail',
        'braintree_local_payment_allowed_methods',
      ];
      const data = await this.getCachedResponse(this.getConfig, 'getBraintreeConfig', configs);

      if (data) {
        this.setData({
          environment: data.braintree_environment,
          merchantAccountId: data.braintree_merchant_account_id,
          vaultActive: data.braintree_cc_vault_active === '1',
          vaultVerifyCvv: data.braintree_cc_vault_cvv,
          threeDSThresholdAmount: data.braintree_3dsecure_threshold_amount
            ? parseFloat(data.braintree_3dsecure_threshold_amount)
            : 0,
          threeDSEnabled: data.braintree_3dsecure_verify_3dsecure,
          alwaysRequestThreeDS: data.braintree_3dsecure_always_request_3ds,
          google: {
            buttonColor: data.braintree_googlepay_btn_color === '0' ? 'white' : 'black',
            cCTypes: markRaw(data.braintree_googlepay_cctypes.split(',')),
            merchantId: data.braintree_googlepay_merchant_id,
            vaultActive: data.braintree_googlepay_vault_active,
          },
          lpm: {
            allowedMethods: data.braintree_local_payment_allowed_methods.split(','),
            fallbackText: data.braintree_local_payment_fallback_button_text,
            redirectOnFail: data.braintree_local_payment_redirect_on_fail,
          },
          paypal: {
            merchantNameOverride: data.braintree_paypal_merchant_name_override,
            merchantCountry: data.braintree_paypal_merchant_country,
            requireBillingAddress: data.braintree_paypal_require_billing_address,
            sendCartLineItems: data.braintree_paypal_send_cart_line_items,
            buttonLabel: data.braintree_paypal_button_location_checkout_type_paypal_label,
            buttonColor: data.braintree_paypal_button_location_checkout_type_paypal_color,
            buttonShape: data.braintree_paypal_button_location_checkout_type_paypal_shape,
            vaultActive: data.braintree_paypal_vault_active,
          },
        });
      }
    },

    async createClientToken() {
      const clientToken = await this.getCachedResponse(createClientToken, 'createClientToken');

      if (clientToken?.data?.createBraintreeClientToken) {
        this.setData({
          clientToken: clientToken.data.createBraintreeClientToken,
        });
      }
    },

    setClientInstance(clientInstance) {
      this.setData({
        clientInstance,
      });
    },

    setThreeDSInstance(threeDSecureInstance) {
      this.setData({
        threeDSecureInstance,
      });
    },

    getPayPalLineItems(includeShipping = true) {
      const items = [];

      if (!this.paypal.sendCartLineItems) {
        return items;
      }

      const { cartItems, totalSegments } = useCartStore();

      Object.values(cartItems).forEach((cartItem) => {
        items.push({
          name: cartItem.name,
          kind: 'debit',
          quantity: cartItem.qty,
          unitAmount: cartItem.price_incl_tax,
          productCode: cartItem.product_sku,
          description: '',
        });
      });

      totalSegments.forEach((segment) => {
        const { code } = segment;
        if (code === 'giftwrapping' || code === 'shipping' || code === 'customerbalance'
        || code === 'reward' || code === 'discount') {
          // If we aren't including shipping then we can ship the shipping segment.
          if (!includeShipping && code === 'shipping') {
            return;
          }

          const unitAmount = code === 'giftwrapping'
            ? parseFloat(segment.extension_attributes.gw_items_price_incl_tax) : segment.value;

          // If the unit amount is 0 then we only need to add the line item for shipping.
          if (!unitAmount && code !== 'shipping') {
            return;
          }

          items.push({
            name: segment.title,
            kind: segment.value >= 0 ? 'debit' : 'credit',
            quantity: 1,
            unitAmount: Math.abs(unitAmount),
          });
        }

        if (code === 'giftcardaccount') {
          const giftcards = JSON.parse(segment.extension_attributes.gift_cards);

          giftcards.forEach((giftcard) => {
            items.push({
              name: giftcard.c,
              kind: 'credit',
              quantity: 1,
              unitAmount: giftcard.a,
            });
          });
        }
      });

      return items;
    },

    setErrorMessage(errorMessage) {
      this.setData({
        errorMessage,
      });
    },

    clearErrorMessage() {
      this.setData({
        errorMessage: null,
      });
    },

    escapeNonAsciiCharacters(str) {
      return str
        .split('')
        .map((c) => (
          // Intentional disable to check for invisible characters.
          // eslint-disable-next-line no-control-regex
          /[^\x00-\x7F]$/.test(c) ? c : c.split('').map((a) => `\\u00${a.charCodeAt().toString(16)}`).join('')
        ))
        .join('');
    },

    async getVaultedMethods() {
      const result = await getVaultedMethods();

      this.setData({
        vaultedMethods: result,
      });
    },

    selectVaultedMethod(vaultedMethod) {
      this.unselectVaultedMethods();
      this.setData({
        vaultedMethods: {
          [vaultedMethod.publicHash]: {
            selected: true,
          },
        },
      });
    },

    mapCartTypes(cartType) {
      switch (cartType) {
        case 'AE':
          return 'american-express';
        case 'DI':
          return 'discover';
        case 'DN':
          return 'diners-club';
        case 'JCB':
          return 'jcb';
        case 'MC':
          return 'master-card';
        case 'MI':
          return 'maestro';
        case 'UPD':
          return 'unionpay';
        case 'VI':
          return 'visa';
        default:
          return '';
      }
    },

    unselectVaultedMethods() {
      Object.keys(this.vaultedMethods).forEach((publicHash) => {
        this.setData({
          vaultedMethods: {
            [publicHash]: {
              selected: false,
            },
          },
        });
      });
    },

    createCacheKey(configs) {
      return configs.join('-');
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
    clearCache(cacheKey) {
      if (cacheKey) {
        this.setData({
          cache: {
            [cacheKey]: undefined,
          },
        });
      }
    },
  },
});
