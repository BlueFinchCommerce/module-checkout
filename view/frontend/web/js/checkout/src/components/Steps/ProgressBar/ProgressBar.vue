<template>
  <div class="progress-bar-container" id="progress-bar">
    <router-link aria-label="progress-bar-link"
                 to="/checkout"
                 class="details active"
                 @click="goToYouDetails">
      <div class="details-icon">
        <YourDetails/>
      </div>
      <TextField class="details-text" :text="$t('progressBar.detailStepTitle')" font-weight="325"/>
    </router-link>
    <p class="progress-bar-divider shipping-divider" :class="{active: shippingActive}"></p>
    <router-link aria-label="progress-bar-link"
                 :to="shippingActive ? '/shipping' : ''"
                 :class="{active: shippingActive}"
                 class="shipping"
                 @click="shippingActive ? goToShipping() : null">
      <div class="shipping-icon">
        <Shipping/>
      </div>
      <TextField :text="$t('progressBar.shippingStepTitle')" font-weight="325"/>
    </router-link>
    <p class="progress-bar-divider payment-divider" :class="{active: paymentActive}"></p>
    <router-link aria-label="progress-bar-link"
                 :to="paymentActive ? '/payments' : ''"
                 :class="{active: paymentActive}"
                 class="payment"
                 @click="paymentActive ? goToPayment() : null">
      <div class="payment-icon">
        <Payment/>
      </div>
      <TextField :text="$t('progressBar.paymentStepTitle')" font-weight="325"/>
    </router-link>
  </div>
</template>
<script>

// Components
import YourDetails from '@/components/Core/Icons/YourDetails/YourDetails.vue';
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

// Stores
import { mapState, mapActions } from 'pinia';
import useStepsStore from '@/stores/StepsStore';

export default {
  name: 'ProgressBar',
  components: {
    YourDetails,
    Shipping,
    Payment,
    TextField,
  },
  computed: {
    ...mapState(useStepsStore, ['yourDetailsActive', 'shippingActive', 'paymentActive']),
  },
  methods: {
    ...mapActions(useStepsStore, ['goToYouDetails', 'goToShipping', 'goToPayment']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
