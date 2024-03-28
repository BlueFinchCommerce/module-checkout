<template>
  <em>This component is for demonstration purposes only.</em>
  <br><br>
  <footer class="footer-container story-book"
    :style="style">
    <div class="footer-block">
      <div>
        <ul class="pay-with__column">
          <li class="pay-with__content">
            <img :src="ApplePayIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="GooglePayIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="PayPalIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="KlarnaIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="ClearpayIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="MaestroPayIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
          <li class="pay-with__content">
            <img :src="VenmoPayIcon"
                 alt="Apple Pay"
                 class="pay-with__icon"/>
          </li>
        </ul>
      </div>
      <TextField
        :text="copyrightText"
      />
    </div>
  </footer>
</template>

<script>
import { reactive, computed } from 'vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Icons
import ApplePaySvg from '../../../icons/payments/colour/icon-applepay-colour.svg';
import GooglePaySvg from '../../../icons/payments/colour/icon-googlepay-colour.svg';
import PayPalSvg from '../../../icons/payments/colour/icon-paypal-colour.svg';
import KlarnaSvg from '../../../icons/payments/colour/icon-klarna-colour.svg';
import MaestroPaySvg from '../../../icons/payments/colour/icon-maestro-colour.svg';
import ClearpaySvg from '../../../icons/payments/colour/icon-clearpay-colour.svg';
import VenmoPayIcon from '../../../icons/payments/colour/icon-venmo-colour.svg';

export default {
  name: 'FooterStoryBook',
  components: {
    TextField,
  },
  props: {
    backgroundColor: {
      type: String,
    },
    copyrightText: {
      type: String,
    },
  },
  computed: {
    ApplePayIcon() {
      return ApplePaySvg;
    },
    GooglePayIcon() {
      return GooglePaySvg;
    },
    PayPalIcon() {
      return PayPalSvg;
    },
    KlarnaIcon() {
      return KlarnaSvg;
    },
    MaestroPayIcon() {
      return MaestroPaySvg;
    },
    ClearpayIcon() {
      return ClearpaySvg;
    },
    VenmoPayIcon() {
      return VenmoPayIcon;
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
      })),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Footer/styles.scss";
</style>
