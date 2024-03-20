<template>
  <div :style="style" class="pay-with__container">
    <TextField v-if="isExpressPaymentsVisible" class="pay-with__message" :text="payWithText" />
    <TextField v-else class="pay-with__message" :text="$t('payNoExpressWithBlockTitle')" />
    <ul class="pay-with__column">
      <li v-for="(paymentType, index) in paymentTypes" :key="index" class="pay-with__content">
        <img v-if="!paymentType.icon.includes('klarna_account')" :src="paymentType.icon.includes('klarna') ? klarnaIcon
          : paymentType.icon.includes('clearpay') ? clearPayIcon
            : paymentType.icon.includes('paypal') ? paypalIcon
              : paymentType.icon.includes('amex') ? amexIcon
                : paymentType.icon.includes('mc') ? mastercardIcon
                  : paymentType.icon.includes('visa') ? visaIcon
                    : paymentType.icon.includes('paypal') ? paypalIcon
                      : paymentType.icon" :alt="paymentType.name" :class="generateClass(paymentType.name)">
      </li>
    </ul>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useAdyenStore from '@/stores/AdyenStore';
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
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['paymentTypes']),
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
  },
  async created() {
    await this.getStoreConfig();
    this.payWithText = window.geneCheckout?.[this.payWithTextId] || this.$t('payWithBlockTitle');

    document.addEventListener(this.payWithTextId, this.setPayWithText);
  },
  unmounted() {
    document.removeEventListener(this.payWithTextId, this.setPayWithText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setPayWithText(event) {
      this.payWithText = event?.detail || this.$t('payWithBlockTitle');
    },

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
