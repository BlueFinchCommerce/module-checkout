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
    <div :class="(isAdyenAvailable && Object.keys(paymentTypes).length === 0)
          ? 'text-loading' : ''">
      <ul class="pay-with__column" v-if="isAdyenAvailable && Object.keys(paymentTypes).length > 0">
        <li
          v-for="(paymentType, index) in paymentTypes"
          :key="index"
          class="pay-with__content"
        >
          <img v-if="!paymentType.icon.includes('klarna_account')"
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
    <div :class="(!isAdyenAvailable
    && isPaymentMethodAvailable('braintree')
    && paymentOptionPriority.length === 0)
          ? 'text-loading' : ''">
      <ul class="pay-with__column" v-if="!isAdyenAvailable
      && isPaymentMethodAvailable('braintree')
      && paymentOptionPriority.length > 0">
        <li
          v-for="(paymentType, index) in paymentOptionPriority"
          :key="index"
          class="pay-with__content"
        >
          <img :src="paymentType === 'card' ? cardPayIcon
          : paymentType === 'applePay' ? applePayIcon
          : paymentType === 'googlePay' ? googlePayIcon
          : paymentType === 'venmo' ? venmoPayIcon
          : paymentType === 'paypal' ? paypalIcon
          : ''"
               :alt="paymentType"
               :class="generateClass(paymentType)"
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useAdyenStore from '@/stores/AdyenStore';
import usePaymentStore from '@/stores/PaymentStore';
import getStaticUrl from '@/helpers/getStaticPath';

import { computed, reactive } from 'vue';
import TextField from '@/components/Core/TextField/TextField.vue';

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
      paymentIcons: [],
      map: [],
      paymentOptionPriority: [],
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['paymentTypes', 'isAdyenAvailable']),
    ...mapState(usePaymentStore, ['getPaymentPriority', 'isPaymentMethodAvailable']),
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

    this.map = {
      braintree: 'card',
      braintree_applepay: 'applePay',
      braintree_googlepay: 'googlePay',
      braintree_venmo: 'venmo',
      braintree_paypal: 'paypal',
    };

    const sortedAvailableMethods = Object.keys(this.map).toSorted((a, b) => (
      this.getPaymentPriority(a) - this.getPaymentPriority(b)
    ));

    this.paymentOptionPriority = sortedAvailableMethods.map((method) => this.map[method]);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    generateClass(paymentName) {
      // Convert paymentType.name to lowercase and replace spaces with underscores
      return paymentName.toLowerCase().replace(/\s+/g, '_');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
