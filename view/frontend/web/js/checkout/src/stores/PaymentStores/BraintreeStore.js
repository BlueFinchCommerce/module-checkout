import { markRaw } from 'vue';
import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

import createClientToken from '@/services/braintree/createClientToken';
import getVaultedMethods from '@/services/braintree/getVaultedMethods';
import getFilteredLpmMethods from '@/helpers/payment/getFilteredLpmMethods';

export default defineStore('brainteeStore', {
  state: () => ({
    cache: {},
    environment: 'sandbox',
    isBraintreeEnabled: null,
    showMagentoPayments: false,
    merchantAccountId: '',
    cCTypes: [],
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
    sendCartLineItems: false,
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
      buttonLabel: '',
      buttonColor: '',
      buttonShape: '',
      vaultActive: false,
      creditActive: false,
      creditColor: '',
      creditLabel: '',
      creditShape: '',
    },
  }),
  getters: {
    selectedVaultMethod: (state) => (
      Object.values(state.vaultedMethods).find(({ selected }) => selected)
    ),
    getFilteredLpmMethods: (state) => (
      getFilteredLpmMethods(state.lpm.allowedMethods)
    ),
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    getInitialConfigValues() {
      return `
        storeConfig {
          braintree_environment,
          braintree_active,
          braintree_merchant_account_id
          braintree_cc_types
          braintree_cc_vault_active
          braintree_cc_vault_cvv
          braintree_send_line_items
          braintree_3dsecure_threshold_amount
          braintree_3dsecure_verify_3dsecure
          braintree_3dsecure_always_request_3ds
          braintree_googlepay_merchant_id
          braintree_googlepay_cctypes
          braintree_googlepay_btn_color
          braintree_googlepay_vault_active
          braintree_paypal_merchant_name_override
          braintree_paypal_merchant_country
          braintree_paypal_require_billing_address
          braintree_paypal_button_location_checkout_type_paypal_label
          braintree_paypal_button_location_checkout_type_paypal_color
          braintree_paypal_button_location_checkout_type_paypal_shape
          braintree_paypal_vault_active
          braintree_paypal_credit_active
          braintree_paypal_credit_color
          braintree_paypal_credit_shape
          braintree_paypal_credit_label
          braintree_local_payment_fallback_button_text
          braintree_local_payment_redirect_on_fail
          braintree_local_payment_allowed_methods
        }
      `;
    },

    handleInitialConfig({ storeConfig }) {
      if (storeConfig) {
        this.setData({
          environment: storeConfig.braintree_environment,
          isBraintreeEnabled: storeConfig.braintree_active,
          merchantAccountId: storeConfig.braintree_merchant_account_id,
          cCTypes: storeConfig.braintree_cc_types?.split(',') || [],
          vaultActive: storeConfig.braintree_cc_vault_active === '1',
          vaultVerifyCvv: storeConfig.braintree_cc_vault_cvv,
          sendCartLineItems: storeConfig.braintree_send_line_items,
          threeDSThresholdAmount: storeConfig.braintree_3dsecure_threshold_amount
            ? parseFloat(storeConfig.braintree_3dsecure_threshold_amount)
            : 0,
          threeDSEnabled: storeConfig.braintree_3dsecure_verify_3dsecure,
          alwaysRequestThreeDS: storeConfig.braintree_3dsecure_always_request_3ds,
          google: {
            buttonColor: storeConfig.braintree_googlepay_btn_color === '0' ? 'white' : 'black',
            cCTypes: storeConfig.braintree_googlepay_cctypes
              ? markRaw(storeConfig.braintree_googlepay_cctypes.split(',')) : [],
            merchantId: storeConfig.braintree_googlepay_merchant_id,
            vaultActive: storeConfig.braintree_googlepay_vault_active,
          },
          lpm: {
            allowedMethods: storeConfig.braintree_local_payment_allowed_methods
              ? storeConfig.braintree_local_payment_allowed_methods.split(',')
              : [],
            fallbackText: storeConfig.braintree_local_payment_fallback_button_text,
            redirectOnFail: storeConfig.braintree_local_payment_redirect_on_fail,
          },
          paypal: {
            merchantNameOverride: storeConfig.braintree_paypal_merchant_name_override,
            merchantCountry: storeConfig.braintree_paypal_merchant_country,
            requireBillingAddress: storeConfig.braintree_paypal_require_billing_address,
            buttonLabel: storeConfig.braintree_paypal_button_location_checkout_type_paypal_label,
            buttonColor: storeConfig.braintree_paypal_button_location_checkout_type_paypal_color,
            buttonShape: storeConfig.braintree_paypal_button_location_checkout_type_paypal_shape,
            vaultActive: storeConfig.braintree_paypal_vault_active,
            creditActive: storeConfig.braintree_paypal_credit_active,
            creditColor: storeConfig.braintree_paypal_credit_color,
            creditShape: storeConfig.braintree_paypal_credit_shape,
            creditLabel: storeConfig.braintree_paypal_credit_label,
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

      if (!this.sendCartLineItems) {
        return items;
      }

      const {
        cart,
        cartItems,
        getCouponValue,
        getGiftWrappingTotal,
      } = useCartStore();

      Object.values(cartItems).forEach((cartItem) => {
        const unitAmount = cartItem.__typename === 'GiftCardCartItem'
          ? cartItem.amount.value
          : cartItem.product.price_range.minimum_price.final_price.value;
        items.push({
          name: cartItem.product.name,
          kind: 'debit',
          quantity: cartItem.quantity,
          unitAmount,
          productCode: cartItem.product.sku,
          description: '',
        });
      });

      if (getGiftWrappingTotal) {
        items.push({
          name: this.$i18n.global.t('orderSummary.giftWrappingTitle'),
          kind: 'debit',
          quantity: 1,
          unitAmount: Math.abs(getGiftWrappingTotal),
        });
      }

      if (cart.applied_store_credit) {
        items.push({
          name: this.$i18n.global.t('orderSummary.storeCreditTitle'),
          kind: 'credit',
          quantity: 1,
          unitAmount: Math.abs(cart.applied_store_credit.applied_balance.value),
        });
      }

      if (cart.applied_reward_points) {
        items.push({
          name: this.$i18n.global.t('orderSummary.rewardsTitle'),
          kind: 'credit',
          quantity: 1,
          unitAmount: Math.abs(cart.applied_reward_points.value),
        });
      }

      if (cart.applied_gift_cards) {
        cart.applied_gift_cards.forEach((giftCard) => {
          items.push({
            name: this.$i18n.global.t('giftCardDiscount.title', { code: giftCard.code }),
            kind: 'credit',
            quantity: 1,
            unitAmount: Math.abs(giftCard.applied_balance.value),
          });
        });
      }

      if (cart.applied_coupons && !cart.prices.discounts) {
        items.push({
          name: this.$i18n.global.t('couponDiscount.title'),
          kind: 'credit',
          quantity: 1,
          unitAmount: Math.abs(getCouponValue(cart.applied_coupons[0].code)),
        });
      }

      if (cart.prices.discounts && Object.keys(cart.prices.discounts).length > 0) {
        items.push({
          name: this.$i18n.global.t('couponDiscount.title'),
          kind: 'credit',
          quantity: 1,
          unitAmount: Math.abs(cart.prices.discounts[0].amount.value),
        });
      }

      if (includeShipping
        && (cart.shipping_addresses?.[0]?.selected_shipping_method?.price_incl_tax?.value
          || cart.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value)) {
        items.push({
          name: this.$i18n.global.t('progressBar.shippingStepTitle'),
          kind: 'debit',
          quantity: 1,
          unitAmount: cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value
            ? Math.abs(cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value)
            : Math.abs(cart.shipping_addresses[0].selected_shipping_method.amount.value),
        });
      }

      if (cart?.prices?.applied_taxes[0]?.amount?.value > 0) {
        items.push({
          name: this.$i18n.global.t('orderSummary.inclTaxTitle'),
          kind: 'debit',
          quantity: 1,
          unitAmount: cart.prices.applied_taxes[0].amount.value
            ? Math.abs(cart.prices.applied_taxes[0].amount.value)
            : 0,
        });
      }

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
      const paymentStore = usePaymentStore();
      const result = await getVaultedMethods();

      this.setData({
        vaultedMethods: result,
      });

      if (Object.keys(result).length) {
        paymentStore.setHasVaultedMethods(true);
      }
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
