<template>
  <div
    :style="style"
    class="pay-with__container"
  >
    <component
      :is="paymentIcon"
      v-for="paymentIcon in paymentIcons"
      :key="paymentIcon"
    />
    <div>
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
import { mapActions, mapState } from 'pinia';
import { computed, reactive } from 'vue';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// Icons
import ApplePaySvg from '@/icons/payments/colour/icon-applepay-colour.svg';
import GooglePaySvg from '@/icons/payments/colour/icon-googlepay-colour.svg';
import ExpressPaySvg from '@/icons/payments/colour/icon-amex-colour.svg';
import PayPalSvg from '@/icons/payments/colour/icon-paypal-colour.svg';
import KlarnaSvg from '@/icons/payments/colour/icon-klarna-colour.svg';
import MaestroPaySvg from '@/icons/payments/colour/icon-maestro-colour.svg';
import MastercardPaySvg from '@/icons/payments/colour/icon-mastercard-colour.svg';
import VisaPaySvg from '@/icons/payments/colour/icon-visa-colour.svg';
import ClearpaySvg from '@/icons/payments/colour/icon-clearpay-colour.svg';
import VenmoPayIcon from '@/icons/payments/colour/icon-venmo-colour.svg';
import DiscoverSvg from '@/icons/payments/colour/icon-discover-colour.svg';
import DinersSvg from '@/icons/payments/colour/icon-diners-colour.svg';
import JCBSvg from '@/icons/payments/colour/icon-jcb-colour.svg';

// Extensions
import paymentIcons from '@/extensions/paymentIcons';

export default {
  name: 'PayWith',
  components: {
    ...paymentIcons(),
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
      paymentIcons: [],
    };
  },
  computed: {
    ...mapState(useBraintreeStore, ['cCTypes']),
    ...mapState(usePaymentStore, ['availableMethods']),
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
    VenmoPayIcon() {
      return `${getStaticUrl(VenmoPayIcon)}`;
    },
  },
  async created() {
    this.paymentIcons = Object.keys(paymentIcons());
    await this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),

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

      return `checkout-${serviceProvider}-${iconName}-icon`;
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
