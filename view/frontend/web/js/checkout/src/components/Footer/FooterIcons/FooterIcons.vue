<template>
  <div
    :style="style"
    class="footer-icons"
    data-cy="footer-icons"
  >
    <component
      :is="footerPaymentIcon"
      v-for="footerPaymentIcon in footerPaymentIcons"
      :key="footerPaymentIcon"
    />

    <div>
      <ul v-if="availableMethods.length > 0">
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
                :data-cy="generateDataCY(cCType, 'braintree')"
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
                :data-cy="generateDataCY(paymentType.code, 'braintree')"
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
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// Icons
import ExpressPaySvg from '@/icons/payments/white/icon-amex-white.svg';
import MaestroPaySvg from '@/icons/payments/white/icon-maestro-white.svg';
import MastercardPaySvg from '@/icons/payments/white/icon-mastercard-white.svg';
import VisaPaySvg from '@/icons/payments/white/icon-visa-white.svg';
import DiscoverSvg from '@/icons/payments/white/icon-discover-white.svg';
import DinersSvg from '@/icons/payments/white/icon-diners-white.svg';
import JCBSvg from '@/icons/payments/white/icon-jcb-white.svg';
import ApplePaySvg from '@/icons/payments/white/icon-applepay-white.svg';
import GooglePaySvg from '@/icons/payments/white/icon-googlepay-white.svg';
import PayPalSvg from '@/icons/payments/white/icon-paypal-white.svg';
import VenmoPayIcon from '@/icons/payments/white/icon-venmo-white.svg';

// Extensions
import footerPaymentIcons from '@/extensions/footerPaymentIcons';

export default {
  name: 'FooterIcons',
  components: {
    ...footerPaymentIcons(),
  },
  props: {
    visibility: {
      type: String,
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
  data() {
    return {
      map: [],
      paymentOptionPriority: [],
      footerPaymentIcons: [],
    };
  },
  computed: {
    ...mapState(useBraintreeStore, ['cCTypes']),
    ...mapState(usePaymentStore, ['availableMethods', 'getPaymentPriority', 'isPaymentMethodAvailable']),
    ApplePayIcon() {
      return getStaticUrl(ApplePaySvg);
    },
    GooglePayIcon() {
      return getStaticUrl(GooglePaySvg);
    },
    PayPalIcon() {
      return getStaticUrl(PayPalSvg);
    },
    VenmoPayIcon() {
      return getStaticUrl(VenmoPayIcon);
    },
  },
  created() {
    this.footerPaymentIcons = Object.keys(footerPaymentIcons());
  },
  methods: {
    generateClass(paymentName) {
      // Convert paymentType.name to lowercase and replace spaces with underscores
      return paymentName.toLowerCase().replace(/\s+/g, '_');
    },

    generateDataCY(paymentIconName, serviceProvider) {
      let iconName = paymentIconName;

      if (serviceProvider === 'adyen') {
        // Extract the string after "logos/" and before ".svg" or ".png" using a regular expression
        const match = paymentIconName.match(/\/logos\/(.*?)\.(svg|png)/);
        if (match) {
          [, iconName] = match;
        }
      }

      return `footer-${serviceProvider}-${iconName}-icon`;
    },

    getCCIcon(type) {
      switch (type) {
        case 'AE':
          return getStaticUrl(ExpressPaySvg);
        case 'DI':
          return getStaticUrl(DiscoverSvg);
        case 'DN':
          return getStaticUrl(DinersSvg);
        case 'JCB':
          return getStaticUrl(JCBSvg);
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
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
