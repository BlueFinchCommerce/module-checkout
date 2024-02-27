<template>
  <div :style="style" class="footer-icons">
    <ul>
      <li><img :src="VisaPayIcon" :alt="VisaPayIcon" /></li>
      <li><img :src="PayPalIcon" :alt="PayPalIcon" style="width:50px"/></li>
      <li><img :src="MaestroPayIcon" :alt="MaestroPayIcon" style="width:20px"/></li>
      <li><img :src="MastercardPayIcon" :alt="MastercardPayIcon" style="width:20px"/></li>
      <li><img :src="ExpressPayIcon" :alt="ExpressPayIcon" /></li>
      <li><img :src="GooglePayIcon" :alt="GooglePayIcon" /></li>
      <li><img :src="ApplePayIcon" :alt="ApplePayIcon" /></li>
      <li><img class="klarna-icon" :src="KlarnaIcon" :alt="KlarnaIcon" /></li>
      <li><img :src="ClearpayIcon" :alt="ClearpayIcon" /></li>
    </ul>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import getStaticUrl from '@/helpers/getStaticPath';
import ApplePaySvg from './icons/icon-apple.svg';
import GooglePaySvg from './icons/icon-google.svg';
import ExpressPaySvg from './icons/icon-express.svg';
import PayPalSvg from './icons/icon-paypal.svg';
import KlarnaSvg from './icons/icon-klarna.svg';
import MaestroPaySvg from './icons/icon-maestro.svg';
import MastercardPaySvg from './icons/icon-mastercard.svg';
import VisaPaySvg from './icons/icon-visa.svg';
import ClearpaySvg from './icons/icon-clearpay.svg';

export default {
  name: 'FooterIcons',
  props: {
    visibility: {
      type: String,
    },
  },
  computed: {
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
