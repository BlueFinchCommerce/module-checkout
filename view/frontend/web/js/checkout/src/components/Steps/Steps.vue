<template>
  <div class="root">
    <div class="steps-container">
      <div class="container">
        <div class="is-hidden-mobile summary">
          <OrderSummaryDesktop />
        </div>
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// components
import OrderSummaryDesktop from
  '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryDesktop/OrderSummaryDesktop.vue';

export default {
  name: 'AppSteps',
  components: {
    OrderSummaryDesktop,
  },
  async created() {
    if (window?.geneCheckout?.callbacks?.onDetailsCreate) {
      Object.values(window.geneCheckout.callbacks.onStepsCreated).forEach(async (callback) => {
        const { default: callbackFunction } = await import(callback);
        callbackFunction();
      });
    }
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
