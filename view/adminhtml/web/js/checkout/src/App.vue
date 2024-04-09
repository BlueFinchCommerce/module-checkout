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
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';
import useCustomerStore from '@/stores/CustomerStore';

import AppHeader from '@/components/Header/Header.vue';
import AppFooter from '@/components/Footer/Footer.vue';
import MockDesktop from '@/components/devices/desktop/desktop.vue';
import MockFull from '@/components/devices/full/full.vue';
import MockLaptop from '@/components/devices/laptop/laptop.vue';
import MockMobile from '@/components/devices/mobile/mobile.vue';
import MockTablet from '@/components/devices/tablet/tablet.vue';
import OrderSummaryMobile from
  '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryMobile/OrderSummaryMobile.vue';
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
      currentStep: 'SignInPage',
      devices: [
        { deviceName: 'MockMobile', displayName: 'Mobile' },
        { deviceName: 'MockTablet', displayName: 'Tablet' },
        { deviceName: 'MockLaptop', displayName: 'Laptop' },
        { deviceName: 'MockDesktop', displayName: 'Desktop' },
        { deviceName: 'MockFull', displayName: 'Full' },
      ],
      checkoutSteps: [
        { stepName: 'SignInPage', displayName: 'Sign In' },
        { stepName: 'YourDetails', displayName: 'Your Details' },
        { stepName: 'Shipping', displayName: 'Shipping' },
        { stepName: 'Payment', displayName: 'Payment' },
      ],
    };
  },
  computed: {
    ...mapState(useStepsStore, ['signInPageActive', 'yourDetailsActive', 'shippingActive', 'paymentActive']),
  },
  async created() {
    this.goToSignInPage();
    await this.getInitialConfig();
    this.dispatchDeviceType(this.currentDevice);
    this.dispatchStep(this.currentStep);

    document.dispatchEvent(new Event('gene-better-checkout-loaded'));
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToSignInPage', 'goToYouDetails', 'goToShipping', 'goToPayment']),
    ...mapActions(useCustomerStore, ['dummyLogIn', 'dummyLogOut']),

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
        case 'SignInPage':
          this.dummyLogOut();
          this.goToSignInPage();
          break;
        case 'YourDetails':
          this.dummyLogIn();
          this.goToYouDetails();
          break;
        case 'Shipping':
          this.dummyLogIn();
          this.goToShipping();
          break;
        case 'Payment':
          this.dummyLogIn();
          this.goToPayment();
          break;
        default:
          break;
      }
      this.dispatchStep(step.stepName);
    },

    dispatchStep(stepName) {
      document.dispatchEvent(new CustomEvent('switchDisplayedStep', { detail: stepName }));
    },
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
