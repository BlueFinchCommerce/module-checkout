<template>
<div :style="style" class="pay-with__container">
  <TextField class="pay-with__message" v-if="isExpressPaymentsVisible" :text="payWithText" />
  <TextField class="pay-with__message" v-else :text="$t('payNoExpressWithBlockTitle')" />
  <ul class="pay-with__column">
    <li class="pay-with__content" v-for="(icon, index) in icons" :key="index">
      <img :src="icon.icon" :alt="icon.icon"/>
    </li>
  </ul>
</div>
</template>

<script>

import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import getStaticUrl from '@/helpers/getStaticPath';
import { computed, reactive } from 'vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import AmericanExpress from './icons/AmericanExpress.svg';
import ClearPay from './icons/ClearPay.svg';
import Klarna from './icons/Klarna.svg';
import MasterCard from './icons/MasterCard.svg';
import Visa from './icons/Visa.svg';

export default {
  name: 'PayWith',
  components: {
    TextField,
  },
  data() {
    return {
      payWithText: '',
      payWithTextId: 'gene-bettercheckout-paywith-text'
    }
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
  computed: {
    icons() {
      return [
        { icon: `${getStaticUrl(MasterCard)}` },
        { icon: `${getStaticUrl(Visa)}` },
        { icon: `${getStaticUrl(AmericanExpress)}` },
        { icon: `${getStaticUrl(Klarna)}` },
        { icon: `${getStaticUrl(ClearPay)}` },
      ];
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
  async created() {
    await this.getStoreConfig();
    this.payWithText = window.geneCheckout?.[this.payWithTextId] || this.$t('payWithBlockTitle')

    document.addEventListener(this.payWithTextId, this.setPayWithText)
  },
  unmounted() {
    document.removeEventListener(this.payWithTextId, this.setPayWithText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setPayWithText(event) {
      this.payWithText = event?.detail || this.$t('payWithBlockTitle');
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
