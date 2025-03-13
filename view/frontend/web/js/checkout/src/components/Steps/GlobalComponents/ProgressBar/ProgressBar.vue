<template>
  <div class="progress-bar-container" id="progress-bar" v-if="progressBarVisible">
    <router-link aria-label="progress-bar-link to-details-page"
                 to="/checkout"
                 :tabindex="shippingActive ? 0 : -1"
                 class="details active"
                 data-cy="progress-bar-details-trigger"
                 @click="goToYouDetails">
      <StepCompletedIcon v-if="shippingActive"/>
      <div class="number active" v-if="!shippingActive">
        <p data-cy="progerss-bar-one">1</p>
      </div>
      <TextField
        class="details-text"
        :text="$t('progressBar.Details')"
        :data-cy="'progress-bar-details-text'"
      />
    </router-link>
    <div class="progress-bar-arrow" :class="{active: shippingActive}">
      <ProgressBarArrow/>
    </div>
    <router-link aria-label="progress-bar-link to-shipping-page"
                 :to="shippingActive ? '/shipping' : ''"
                 :tabindex=" paymentActive ? 0 : -1 "
                 :class="{active: shippingActive}"
                 class="shipping"
                 data-cy="progress-bar-shipping-trigger"
                 @click="shippingActive ? goToShipping() : null">
      <StepCompletedIcon v-if="paymentActive"/>
      <div class="number" :class="{active: shippingActive}" v-if="!paymentActive">
        <p data-cy="progerss-bar-two">2</p>
      </div>
      <TextField
        :text="$t('Shipping')"
        :data-cy="'progress-bar-shipping-text'"
      />
    </router-link>
    <div class="progress-bar-arrow" :class="{active: paymentActive}">
      <ProgressBarArrow/>
    </div>
    <router-link aria-label="progress-bar-link to-payment-page"
                 :to="paymentActive ? '/payments' : ''"
                 :class="{active: paymentActive}"
                 tabindex="-1"
                 class="payment"
                 data-cy="progress-bar-payment-trigger"
                 @click="paymentActive ? goToPayment() : null">
      <div class="number" :class="{active: paymentActive}">
        <p data-cy="progerss-bar-three">3</p>
      </div>
      <TextField
        :text="$t('Payment')"
        :data-cy="'progress-bar-payment-text'"
      />
    </router-link>
  </div>
</template>
<script>

// Components
import ProgressBarArrow from '@/components/Core/Icons/ProgressBarArrow/ProgressBarArrow.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import StepCompletedIcon from '@/components/Core/Icons/StepCompletedIcon/StepCompletedIcon.vue';

// Stores
import { mapState, mapActions } from 'pinia';
import useStepsStore from '@/stores/StepsStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

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
