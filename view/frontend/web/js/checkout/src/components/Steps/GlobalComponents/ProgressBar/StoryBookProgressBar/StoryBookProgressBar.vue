<template>
  <em>This component is for demonstration purposes only.</em>
  <br><br>
  <div class="progress-bar-container story-book">
    <span class="details active">
      <StepCompletedIcon v-if="detailsActive"/>
      <span class="number active"  v-if="!detailsActive">
        <span>1</span>
      </span>
      <TextField class="details-text" :text="firstStepTitle"/>
    </span>
    <div class="progress-bar-arrow" :class="{active: shippingActive}">
      <ProgressBarArrow/>
    </div>
    <span aria-label="progress-bar-link to-shipping-page"
                 :class="{active: shippingActive}"
                 class="shipping">
      <StepCompletedIcon v-if="shippingActive"/>
      <span class="number" v-if="!shippingActive" :class="{active: shippingActive}">
        <span>2</span>
      </span>
      <TextField :text="secondStepTitle"/>
    </span>
    <div class="progress-bar-arrow" :class="{active: paymentActive}">
      <ProgressBarArrow/>
    </div>
    <span aria-label="progress-bar-link to-payment-page"
                 :class="{active: paymentActive}"
                 class="payment">
      <StepCompletedIcon  v-if="paymentActive"/>
      <span class="number" v-if="!paymentActive" :class="{active: paymentActive}">
        <span>3</span>
      </span>
      <TextField :text="thirdStepTitle"/>
    </span>
  </div>
</template>
<script>

// Components
import ProgressBarArrow from '@/components/Core/Icons/ProgressBarArrow/ProgressBarArrow.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import StepCompletedIcon from '@/components/Core/Icons/StepCompletedIcon/StepCompletedIcon.vue';

export default {
  name: 'ProgressBarStoryBook',
  components: {
    ProgressBarArrow,
    TextField,
    StepCompletedIcon,
  },
  props: {
    firstStepTitle: {
      type: String,
    },
    secondStepTitle: {
      type: String,
    },
    thirdStepTitle: {
      type: String,
    },
    paymentActive: {
      type: Boolean,
      default: false,
    },
    shippingActive: {
      type: Boolean,
      default: false,
    },
    detailsActive: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
