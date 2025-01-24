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
    document.getElementById('bluefinch-checkout-root').setAttribute('role', 'main');
    await this.getInitialConfig();

    this.setInitialStepState();

    if (window?.bluefinchCheckout?.callbacks?.onCreate) {
      Object.values(window.bluefinchCheckout.callbacks.onCreate).forEach(async (callback) => {
        const { default: callbackFunction } = await import(callback);
        callbackFunction();
      });
    }

    beginCheckoutDataLayer();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['setInitialStepState']),
  },
};
</script>
<style lang="scss">
@import "@/styles/global/variables";
@import "./styles/_core.scss";
</style>
