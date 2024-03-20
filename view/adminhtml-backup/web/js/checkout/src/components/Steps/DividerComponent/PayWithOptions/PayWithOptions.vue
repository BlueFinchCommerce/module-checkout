<template>
  <div class="pay-with-container">
    <ul>
      <li>
        <img :src="masterCard" :alt="$t('payWith.masterCard')"/>
      </li>
      <li>
        <img :src="visa" :alt="$t('payWith.visa')"/>
      </li>
      <li>
        <img :src="americanExpress" :alt="$t('payWith.americanExpress')"/>
      </li>
      <li>
        <img :src="clearPay" :alt="$t('payWith.clearPay')"/>
      </li>
      <li>
        <img :src="klarna" :alt="$t('payWith.klarna')"/>
      </li>
    </ul>
  </div>
</template>
<script>
import getStaticUrl from '@/helpers/getStaticPath';

import masterCardIcon from './paymentIcons/masterIcon.svg';
import visaIcon from './paymentIcons/Visa.svg';
import clearPayIcon from './paymentIcons/ClearPay.svg';
import klarnaIcon from './paymentIcons/Klarna.svg';
import americanExpressIcon from './paymentIcons/AmericanExpressWhite.svg';

export default {
  name: 'PayWithOptions',
  computed: {
    masterCard() {
      return `${getStaticUrl(masterCardIcon)}`;
    },
    visa() {
      return `${getStaticUrl(visaIcon)}`;
    },
    clearPay() {
      return `${getStaticUrl(clearPayIcon)}`;
    },
    klarna() {
      return `${getStaticUrl(klarnaIcon)}`;
    },
    americanExpress() {
      return `${getStaticUrl(americanExpressIcon)}`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
