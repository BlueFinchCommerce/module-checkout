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
  <div id="bluefinch-checkout-root">
    <component :is="currentDevice">
      <Loader />
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
  <div v-if="currentStep === 'SignInPage'" class="switchers">
    <button
      v-for="(user, index) in userType"
      :key="index"
      :class="{
        'action-secondary': currentUser === user.userTypeName
      }"
      @click="setUserStatus(user)"
    >
      {{ user.displayName }}
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
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
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
    Loader,
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
      currentUser: 'NoUser',
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
      userType: [
        { userTypeName: 'NoUser', displayName: 'No User' },
        { userTypeName: 'GuestUser', displayName: 'Guest User' },
        { userTypeName: 'RegisteredUser', displayName: 'Registered User' },
      ],
    };
  },
  computed: {
    ...mapState(useStepsStore, ['signInPageActive', 'yourDetailsActive', 'shippingActive', 'paymentActive']),
  },
  async created() {
    this.goToSignInPage();
    this.dummyLogOut(this.currentStep);
    await this.getInitialConfig();
    this.dispatchDeviceType(this.currentDevice);
    this.dispatchStep(this.currentStep);

    document.dispatchEvent(new Event('bluefinch-checkout-loaded'));
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToSignInPage', 'goToYouDetails', 'goToShipping', 'goToPayment']),
    ...mapActions(useCustomerStore, ['dummyLogIn', 'dummyLogOut', 'dummyUserType']),

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
          this.dummyLogOut(step.stepName);
          this.setUserStatus({ userTypeName: 'NoUser', displayName: 'No User' });
          this.goToSignInPage();
          break;
        case 'YourDetails':
          this.dummyLogIn(step.stepName);
          this.goToYouDetails();
          break;
        case 'Shipping':
          this.dummyLogOut(step.stepName);
          this.dummyUserType('NoUser');
          this.goToShipping();
          break;
        case 'Payment':
          this.dummyLogOut(step.stepName);
          this.dummyUserType('NoUser');
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

    setUserStatus(user) {
      this.currentUser = user.userTypeName;
      this.dummyUserType(user.userTypeName);
      this.dispatchUserStatus(user.userTypeName);
    },

    dispatchUserStatus(userType) {
      document.dispatchEvent(new CustomEvent('updateUserStatus', { detail: userType }));
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
    margin-bottom: 20px;
  }

  #bluefinch-checkout-root {
    margin: 20px 0;
  }
</style>
