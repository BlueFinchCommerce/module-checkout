<template>
  <AppHeader />
  <Steps />
  <AppFooter />
  <OrderSummaryMobile />
</template>
<script>
import useConfigStore from '@/stores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';
import { mapActions } from 'pinia';

import AppHeader from '@/components/Header/Header.vue';
import AppFooter from '@/components/Footer/Footer.vue';
import OrderSummaryMobile from
  '@/components/Steps/OrderSummary/OrderSummaryMobile/OrderSummaryMobile.vue';
import Steps from '@/components/Steps/Steps.vue';

import getUrlQuery from '@/helpers/getUrlQuery';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    OrderSummaryMobile,
    Steps,
  },
  async created() {
    document.querySelector('html').classList.add('vue-checkout-active');
    document.getElementById('gene-better-checkout-root').setAttribute('role', 'main');
    await this.getStoreConfig();

    this.setInitialStepState();
    // If we have a Amazon redirect URL then go to that page.
    if (getUrlQuery('amazonCheckoutSessionId')) {
      const stepsStore = useStepsStore();
      stepsStore.goToAdyenAmazonReviw();
    }
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useStepsStore, ['setInitialStepState', 'goToAdyenAmazonReviw']),
  },
};
</script>
<style lang="scss">
@import "@/styles/global/variables";
@import "./styles/_core.scss";
</style>
