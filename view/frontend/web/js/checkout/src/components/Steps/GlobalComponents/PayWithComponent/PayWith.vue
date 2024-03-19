<template>
  <div
    :style="style"
    class="pay-with__container"
  >
    <TextField
      v-if="isExpressPaymentsVisible"
      class="pay-with__message"
      :text="payWithText"
    />
    <TextField
      v-else
      class="pay-with__message"
      :text="$t('payNoExpressWithBlockTitle')"
    />
    <template v-if="isAdyenAvailable">
      <div
        :class="(Object.keys(paymentTypes).length === 0)
          ? 'text-loading' : ''"
      >
        <ul
          v-if="Object.keys(paymentTypes).length > 0"
          class="pay-with__column"
        >
          <li
            v-for="(paymentType, index) in paymentTypes"
            :key="index"
            class="pay-with__content"
          >
            <img
              v-if="!paymentType.icon.includes('klarna_account')"
              :src="paymentType.icon.includes('klarna') ? klarnaIcon
                : paymentType.icon.includes('clearpay') ? clearPayIcon
                  : paymentType.icon.includes('paypal') ? paypalIcon
                    : paymentType.icon.includes('amex') ? amexIcon
                      : paymentType.icon.includes('mc') ? mastercardIcon
                        : paymentType.icon.includes('visa') ? visaIcon
                          : paymentType.icon"
              :alt="paymentType.name"
              :class="generateClass(paymentType.name)"
            >
          </li>
        </ul>
      </div>
    </template>
    <div :class="availableMethods.length === 0 ? 'text-loading' : ''">
      <ul class="pay-with__column"
      v-if="availableMethods.length > 0">
        <template
          v-for="(paymentType, index) in availableMethods"
          :key="index"
        >
          <template v-if="paymentType.code === 'braintree' && cCTypes.length > 0">
            <li
              v-for="cCType in cCTypes"
              :key="cCType"
              class="pay-with__content"
            >
              <img
                :alt="cCType"
                :src="getCCIcon(cCType)"
              >
            </li>
          </template>
          <template
            v-else-if="paymentType.code !== 'braintree_cc_vault'
              && paymentType.code !== 'braintree_ach_direct_debit' && paymentType.code !== 'braintree_local_payment'"
          >
            <li
              v-if="paymentType.code.includes('braintree')"
              class="pay-with__content"
            >
              <img
                :src="paymentType.code === 'braintree_applepay' ? applePayIcon
                  : paymentType.code === 'braintree_googlepay' ? googlePayIcon
                    : paymentType.code === 'braintree_venmo' ? venmoPayIcon
                      : paymentType.code === 'braintree_paypal' ? paypalIcon
                        : ''"
                :alt="paymentType.title"
                :class="generateClass(paymentType.title)"
              >
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import { computed, reactive } from 'vue';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// icons
import visa from './icons/Visa.svg';
import mastercard from './icons/MasterCard.svg';
import amex from './icons/AmericanExpress.svg';
import clearPay from './icons/ClearPay.svg';
import klarna from './icons/Klarna.svg';
import paypal from './icons/Paypal.svg';
import googlePay from './icons/GooglePay.svg';
import applePay from './icons/ApplePay.svg';
import cardPay from './icons/CardPay.svg';
import venmoIcon from './icons/VenmoIcon.svg';
import AE from './icons/AE.png';
import CUP from './icons/CUP.png';
import DI from './icons/DI.png';
import DN from './icons/DN.png';
import JCB from './icons/JCB.png';
import MC from './icons/MC.png';
import MI from './icons/MI.png';
import PP from './icons/PP.png';
import VI from './icons/VI.png';

export default {
  name: 'PayWith',
  components: {
    TextField,
  },
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    background: {
      type: String,
    },
    isExpressPaymentsVisible: {
      type: Boolean,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        background: reactiveProps.background,
        width: reactiveProps.width,
        height: reactiveProps.height,
      })),
    };
  },
  data() {
    return {
      payWithText: '',
      payWithTextId: 'gene-bettercheckout-paywith-text',
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['paymentTypes', 'isAdyenAvailable']),
    ...mapState(useBraintreeStore, ['cCTypes']),
    ...mapState(usePaymentStore, ['availableMethods', 'getPaymentPriority', 'isPaymentMethodAvailable']),
    visaIcon() {
      return `${getStaticUrl(visa)}`;
    },
    mastercardIcon() {
      return `${getStaticUrl(mastercard)}`;
    },
    amexIcon() {
      return `${getStaticUrl(amex)}`;
    },
    clearPayIcon() {
      return `${getStaticUrl(clearPay)}`;
    },
    klarnaIcon() {
      return `${getStaticUrl(klarna)}`;
    },
    paypalIcon() {
      return `${getStaticUrl(paypal)}`;
    },
    applePayIcon() {
      return `${getStaticUrl(applePay)}`;
    },
    googlePayIcon() {
      return `${getStaticUrl(googlePay)}`;
    },
    cardPayIcon() {
      return `${getStaticUrl(cardPay)}`;
    },
    venmoPayIcon() {
      return `${getStaticUrl(venmoIcon)}`;
    },
  },
  async created() {
    await this.getStoreConfig();
    this.payWithText = window.geneCheckout?.[this.payWithTextId] || this.$t('payWithBlockTitle');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    generateClass(paymentName) {
      // Convert paymentType.name to lowercase and replace spaces with underscores
      return paymentName.toLowerCase().replace(/\s+/g, '_');
    },

    getCCIcon(type) {
      switch (type) {
        case 'AE':
          return AE;
        case 'CUP':
          return CUP;
        case 'DI':
          return DI;
        case 'DN':
          return DN;
        case 'JCB':
          return JCB;
        case 'MC':
          return MC;
        case 'MI':
          return MI;
        case 'PP':
          return PP;
        case 'VI':
          return VI;
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
