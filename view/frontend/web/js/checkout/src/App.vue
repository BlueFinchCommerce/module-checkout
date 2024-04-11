<template>
  <Loader />
  <AppHeader />
  <Steps />
  <AppFooter />
  <OrderSummaryMobile />
</template>
<script>
// Stores
import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';

// Components
import AppHeader from '@/components/Header/Header.vue';
import AppFooter from '@/components/Footer/Footer.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
import OrderSummaryMobile from
  '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryMobile/OrderSummaryMobile.vue';
import Steps from '@/components/Steps/Steps.vue';

// Helpers
import getUrlQuery from '@/helpers/storeConfigs/getUrlQuery';
import beginCheckoutDataLayer from '@/helpers/dataLayer/beginCheckoutDataLayer';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    Loader,
    OrderSummaryMobile,
    Steps,
  },
  async created() {
    document.querySelector('html').classList.add('vue-checkout-active');
    document.getElementById('gene-better-checkout-root').setAttribute('role', 'main');
    await this.getInitialConfig();

    this.setInitialStepState();
    // If we have a Amazon redirect URL then go to that page.
    if (getUrlQuery('amazonCheckoutSessionId')) {
      const stepsStore = useStepsStore();
      stepsStore.goToAdyenAmazonReviw();
    }

    beginCheckoutDataLayer();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['setInitialStepState', 'goToAdyenAmazonReviw']),
  },
};
</script>
<style lang="scss">
@import "@/styles/global/variables";
@import "./styles/_core.scss";
</style>
