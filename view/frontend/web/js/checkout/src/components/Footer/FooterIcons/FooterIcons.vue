<template>
  <div
    :style="style"
    class="footer-icons"
  >
    <template v-if="isAdyenAvailable">
      <div :class="(Object.keys(paymentTypes).length === 0) ? 'text-loading' : ''">
        <ul v-if="Object.keys(paymentTypes).length > 0">
          <li
            v-for="(paymentType, index) in paymentTypes"
            :key="index"
            class="pay-with__content"
          >
            <img
              v-if="!paymentType.icon.includes('klarna_account')"
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
    </template>
    <div :class="availableMethods.length === 0 ? 'text-loading' : ''">
      <ul class="pay-with__column">
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
            v-else-if="paymentType.code !== 'braintree_cc_vault' && paymentType.code !== 'braintree_ach_direct_debit'
              && paymentType.code !== 'braintree_local_payment' && paymentType.code !== 'braintree_paypal_vault'"
          >
            <li
              v-if="paymentType.code.includes('braintree')"
              class="pay-with__content"
            >
              <img
                :src="paymentType.code === 'braintree_applepay' ? ApplePayIcon
                  : paymentType.code === 'braintree_googlepay' ? GooglePayIcon
                    : paymentType.code === 'braintree_venmo' ? VenmoPayIcon
                      : paymentType.code === 'braintree_paypal' ? PayPalIcon
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
import { mapState } from 'pinia';
import { computed, reactive } from 'vue';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// Icons
import ApplePaySvg from '@/icons/payments/white/icon-applepay.svg';
import GooglePaySvg from '@/icons/payments/white/icon-google.svg';
import ExpressPaySvg from '@/icons/payments/white/icon-express.svg';
import PayPalSvg from '@/icons/payments/white/icon-paypal.svg';
import KlarnaSvg from '@/icons/payments/white/icon-klarna.svg';
import MaestroPaySvg from '@/icons/payments/white/icon-maestro.svg';
import MastercardPaySvg from '@/icons/payments/white/icon-mastercard.svg';
import VisaPaySvg from '@/icons/payments/white/icon-visa.svg';
import ClearpaySvg from '@/icons/payments/white/icon-clearpay.svg';
import CardPayIcon from '@/icons/payments/white/icon-cardpay.svg';
import VenmoPayIcon from '@/icons/payments/white/icon-venmo.svg';
import DI from '@/icons/payments/white/DI.png';
import DN from '@/icons/payments/white/DN.png';
import JCB from '@/icons/payments/white/JCB.png';

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
    ...mapState(useBraintreeStore, ['cCTypes']),
    ...mapState(usePaymentStore, ['availableMethods', 'getPaymentPriority', 'isPaymentMethodAvailable']),
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

    getCCIcon(type) {
      switch (type) {
        case 'AE':
          return getStaticUrl(ExpressPaySvg);
        case 'DI':
          return DI;
        case 'DN':
          return DN;
        case 'JCB':
          return JCB;
        case 'MC':
          return getStaticUrl(MastercardPaySvg);
        case 'MI':
          return getStaticUrl(MaestroPaySvg);
        case 'VI':
          return getStaticUrl(VisaPaySvg);
        default:
          return '';
      }
    },
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
