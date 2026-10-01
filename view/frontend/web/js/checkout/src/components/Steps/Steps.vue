<template>
  <div class="root">
    <div class="steps-container">
      <div class="container">
        <div class="is-hidden-mobile summary">
          <OrderSummaryDesktop />
          <template v-if="isDesktopViewport">
            <component
              :is="belowOrderSummaryComponent"
              v-for="belowOrderSummaryComponent in belowOrderSummaryComponents"
              :key="belowOrderSummaryComponent"
            />
          </template>
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
import functionExtension from '@/extensions/functionExtension';
import belowOrderSummaryExtensions from '@/extensions/belowOrderSummaryExtensions';

export default {
  name: 'AppSteps',
  components: {
    OrderSummaryDesktop,
    ...belowOrderSummaryExtensions(),
  },
  data() {
    return {
      belowOrderSummaryComponents: [],
      isDesktopViewport: false,
    };
  },
  async created() {
    this.belowOrderSummaryComponents = Object.keys(belowOrderSummaryExtensions());
    if (this.belowOrderSummaryComponents.length > 0) {
      this.isDesktopViewport = window.matchMedia('(min-width: 769px)').matches;
    }
    await functionExtension('onStepsCreated');
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
