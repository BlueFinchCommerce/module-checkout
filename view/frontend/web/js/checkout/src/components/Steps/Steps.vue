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
import functionExtension from '@/extensions/functionExtension';

export default {
  name: 'AppSteps',
  components: {
    OrderSummaryDesktop,
  },
  async created() {
    await functionExtension('onStepsCreated');
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
