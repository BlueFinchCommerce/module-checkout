<template>
  <div class="switchers">
    <button
      v-for="(device, index) in devices"
      :key="index"
      :class="{
        'action-secondary': currentDevice === device.deviceName
      }"
      @click="switchDevice(device)"
    >
      {{ device.displayName }}
    </button>
  </div>
  <div id="gene-better-checkout-root">
    <component :is="currentDevice">
      <AppHeader />
      <Steps />
      <AppFooter />
      <OrderSummaryMobile />
    </component>
  </div>
  <div class="switchers">
    <button
      v-for="(step, index) in checkoutSteps"
      :key="index"
      :class="{
        'action-secondary': currentStep === step.stepName
      }"
      @click="goToStep(step)"
    >
      {{ step.displayName }}
    </button>
  </div>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';

import AppFooter from '@/components/Footer/Footer.vue';
import AppHeader from '@/components/Header/Header.vue';
import MockDesktop from '@/components/devices/desktop/desktop.vue';
import MockFull from '@/components/devices/full/full.vue';
import MockLaptop from '@/components/devices/laptop/laptop.vue';
import MockMobile from '@/components/devices/mobile/mobile.vue';
import MockTablet from '@/components/devices/tablet/tablet.vue';
import OrderSummaryMobile from
  '@/components/Steps/OrderSummary/OrderSummaryMobile/OrderSummaryMobile.vue';
import Steps from '@/components/Steps/Steps.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
    MockDesktop,
    MockFull,
    MockLaptop,
    MockMobile,
    MockTablet,
    OrderSummaryMobile,
    Steps,
  },
  data() {
    return {
      currentDevice: 'MockDesktop',
      currentStep: 'YourDetails',
      devices: [
        { deviceName: 'MockMobile', displayName: 'Mobile' },
        { deviceName: 'MockTablet', displayName: 'Tablet' },
        { deviceName: 'MockLaptop', displayName: 'Laptop' },
        { deviceName: 'MockDesktop', displayName: 'Desktop' },
        { deviceName: 'MockFull', displayName: 'Full' },
      ],
      checkoutSteps: [
        { stepName: 'YourDetails', displayName: 'Your Details' },
        { stepName: 'Shipping', displayName: 'Shipping' },
        { stepName: 'Payment', displayName: 'Payment' },
      ],
    };
  },
  computed: {
    ...mapState(useStepsStore, ['yourDetailsActive', 'shippingActive', 'paymentActive']),
  },
  async created() {
    await this.getStoreConfig();
    this.dispatchDeviceType(this.currentDevice);
    this.dispatchStep(this.currentStep);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useStepsStore, ['goToYouDetails', 'goToShipping', 'goToPayment']),

    switchDevice(device) {
      this.currentDevice = device.deviceName;
      this.dispatchDeviceType(device.deviceName);
    },

    dispatchDeviceType(deviceName) {
      document.dispatchEvent(new CustomEvent('switchDeviceType', { detail: deviceName }));
    },

    goToStep(step) {
      this.currentStep = step.stepName;
      switch (step.stepName) {
        case 'YourDetails':
          this.goToYouDetails();
          break;
        case 'Shipping':
          this.goToShipping();
          break;
        case 'Payment':
          this.goToPayment();
          break;
        default:
          break;
      }
      this.dispatchStep(step.stepName);
    },

    dispatchStep(stepName) {
      document.dispatchEvent(new CustomEvent('switchDisplayedStep', { detail: stepName }));
    }

  },
};
</script>
<style lang="scss">
  @import "@/styles/global/variables";
  @import "@/styles/_core.scss";
</style>
<style lang="scss" scoped>
  .switchers {
    display: grid;
    gap: 20px;
    grid-auto-flow: column;
    justify-content: center;
  }

  #gene-better-checkout-root {
    margin: 20px 0;
  }
</style>
