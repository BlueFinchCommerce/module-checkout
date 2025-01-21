<template>
  <Loader />
  <AppHeader />
  <Steps />
  <AppFooter />
  <OrderSummaryMobile />
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
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
import lodashMerge from 'lodash.merge';
import lodashSet from 'lodash.set';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    Loader,
    OrderSummaryMobile,
    Steps,
  },
  computed: {
    ...mapState(useConfigStore, ['locale']),
  },
  async created() {
    if (window.geneCheckout.translations) {
      const defaultMessages = this.$i18n.getLocaleMessage('en-GB');
      const localeMessages = this.$i18n.getLocaleMessage(this.locale);
      const mergedMessages = lodashMerge(defaultMessages, localeMessages);
      const translations = JSON.parse(window.geneCheckout.translations);
      Object.keys(translations).forEach((translation) => {
        lodashSet(mergedMessages, translation, translations[translation]);
      });
      this.$i18n.setLocaleMessage(this.locale, mergedMessages);
    }

    document.querySelector('html').classList.add('vue-checkout-active');
    document.getElementById('gene-better-checkout-root').setAttribute('role', 'main');
    await this.getInitialConfig();

    this.setInitialStepState();

    if (window?.geneCheckout?.callbacks?.onCreate) {
      Object.values(window.geneCheckout.callbacks.onCreate).forEach(async (callback) => {
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
