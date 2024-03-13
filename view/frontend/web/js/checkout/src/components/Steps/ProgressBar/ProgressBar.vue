<template>
  <div class="progress-bar-container" id="progress-bar" v-if="progressBarVisible">
    <router-link aria-label="progress-bar-link"
                 to="/checkout"
                 class="details active"
                 @click="goToYouDetails">
      <StepCompletedIcon v-if="shippingActive"/>
      <div class="number active" v-if="!shippingActive">
        <p>1</p>
      </div>
      <TextField class="details-text" :text="$t('progressBar.detailStepTitle')"/>
    </router-link>
    <div class="progress-bar-arrow" :class="{active: shippingActive}">
      <ProgressBarArrow/>
    </div>
    <router-link aria-label="progress-bar-link"
                 :to="shippingActive ? '/shipping' : ''"
                 :class="{active: shippingActive}"
                 class="shipping"
                 @click="shippingActive ? goToShipping() : null">
      <StepCompletedIcon v-if="paymentActive"/>
      <div class="number" :class="{active: shippingActive}" v-if="!paymentActive">
        <p>2</p>
      </div>
      <TextField :text="$t('progressBar.shippingStepTitle')"/>
    </router-link>
    <div class="progress-bar-arrow" :class="{active: paymentActive}">
      <ProgressBarArrow/>
    </div>
    <router-link aria-label="progress-bar-link"
                 :to="paymentActive ? '/payments' : ''"
                 :class="{active: paymentActive}"
                 class="payment"
                 @click="paymentActive ? goToPayment() : null">
      <div class="number" :class="{active: paymentActive}">
        <p>3</p>
      </div>
      <TextField :text="$t('progressBar.paymentStepTitle')"/>
    </router-link>
  </div>
</template>
<script>

// Components
import ProgressBarArrow from '@/components/Core/Icons/ProgressBarArrow/ProgressBarArrow.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import StepCompletedIcon from '@/components/Core/Icons/StepCompletedIcon/StepCompletedIcon.vue';

// Stores
import { mapState, mapActions } from 'pinia';
import useStepsStore from '@/stores/StepsStore';
import useConfigStore from '@/stores/ConfigStore';

export default {
  name: 'ProgressBar',
  components: {
    ProgressBarArrow,
    TextField,
    StepCompletedIcon,
  },
  computed: {
    ...mapState(useStepsStore, ['yourDetailsActive', 'shippingActive', 'paymentActive']),
    ...mapState(useConfigStore, ['progressBarVisible']),
  },
  methods: {
    ...mapActions(useStepsStore, ['goToYouDetails', 'goToShipping', 'goToPayment']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
