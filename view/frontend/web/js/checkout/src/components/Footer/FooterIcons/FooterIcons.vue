<template>
  <div :style="style" class="footer-icons">
    <div :class="(isAdyenAvailable && Object.keys(paymentTypes).length === 0) ? 'text-loading' : ''">
      <ul v-if="isAdyenAvailable && Object.keys(paymentTypes).length > 0">
        <li
          v-for="(paymentType, index) in paymentTypes"
          :key="index"
          class="pay-with__content"
        >
          <img v-if="!paymentType.icon.includes('klarna_account')"
               :src="paymentType.icon.includes('klarna') ? KlarnaIcon
          : paymentType.icon.includes('clearpay') ? ClearpayIcon
          : paymentType.icon.includes('paypal') ? PayPalIcon
          : paymentType.icon.includes('amex') ? ExpressPayIcon
          : paymentType.icon.includes('mc') ? MastercardPayIcon
          : paymentType.icon.includes('visa') ? VisaPayIcon
          : paymentType.icon.includes('google') ? GooglePayIcon
          : paymentType.icon.includes('apple') ? ApplePayIcon
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
      <ul v-if="!isAdyenAvailable
      && isPaymentMethodAvailable('braintree')
      && paymentOptionPriority.length > 0">
        <li
          v-for="(paymentType, index) in paymentOptionPriority"
          :key="index"
          class="pay-with__content"
        >
          <img :src="paymentType === 'card' ? CardPayIcon
          : paymentType === 'applePay' ? ApplePayIcon
          : paymentType === 'googlePay' ? GooglePayIcon
          : paymentType === 'venmo' ? VenmoPayIcon
          : paymentType === 'paypal' ? PayPalIcon
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
import { mapState } from 'pinia';
import useAdyenStore from '@/stores/AdyenStore';
import usePaymentStore from '@/stores/PaymentStore';
import getStaticUrl from '@/helpers/getStaticPath';
import { computed, reactive } from 'vue';

// Icons
import ApplePaySvg from './icons/icon-apple.svg';
import GooglePaySvg from './icons/icon-google.svg';
import ExpressPaySvg from './icons/icon-express.svg';
import PayPalSvg from './icons/icon-paypal.svg';
import KlarnaSvg from './icons/icon-klarna.svg';
import MaestroPaySvg from './icons/icon-maestro.svg';
import MastercardPaySvg from './icons/icon-mastercard.svg';
import VisaPaySvg from './icons/icon-visa.svg';
import ClearpaySvg from './icons/icon-clearpay.svg';
import CardPayIcon from './icons/icon-cardpay.svg';
import VenmoPayIcon from './icons/icon-venmo.svg';

export default {
  name: 'FooterIcons',
  props: {
    visibility: {
      type: String,
    },
  },
  data() {
    return {
      map: [],
      paymentOptionPriority: [],
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['paymentTypes', 'isAdyenAvailable']),
    ...mapState(usePaymentStore, ['getPaymentPriority', 'isPaymentMethodAvailable']),
    ApplePayIcon() {
      return `${getStaticUrl(ApplePaySvg)}`;
    },
    GooglePayIcon() {
      return `${getStaticUrl(GooglePaySvg)}`;
    },
    ExpressPayIcon() {
      return `${getStaticUrl(ExpressPaySvg)}`;
    },
    PayPalIcon() {
      return `${getStaticUrl(PayPalSvg)}`;
    },
    KlarnaIcon() {
      return `${getStaticUrl(KlarnaSvg)}`;
    },
    MaestroPayIcon() {
      return `${getStaticUrl(MaestroPaySvg)}`;
    },
    MastercardPayIcon() {
      return `${getStaticUrl(MastercardPaySvg)}`;
    },
    VisaPayIcon() {
      return `${getStaticUrl(VisaPaySvg)}`;
    },
    ClearpayIcon() {
      return `${getStaticUrl(ClearpaySvg)}`;
    },
    CardPayIcon() {
      return `${getStaticUrl(CardPayIcon)}`;
    },
    VenmoPayIcon() {
      return `${getStaticUrl(VenmoPayIcon)}`;
    },
  },
  methods: {
    generateClass(paymentName) {
      // Convert paymentType.name to lowercase and replace spaces with underscores
      return paymentName.toLowerCase().replace(/\s+/g, '_');
    },
  },
  created() {
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
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        display: reactiveProps.visibility,
      })),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
