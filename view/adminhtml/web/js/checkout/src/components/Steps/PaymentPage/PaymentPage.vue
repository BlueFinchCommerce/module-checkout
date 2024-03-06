<template>
  <div class="payment-step">
    <SavedDeliveryAddress />
    <SavedShippingMethod v-if="isItemRequiringDelivery" />
    <Rewards v-if="rewardsEnabled" />
    <StoreCredit v-if="getTotalSegment('customerbalance')" />
    <div class="payment-page">
      <div class="payment-form">
        <template v-if="cartGrandTotal">
          <ErrorMessage
            v-if="rvvupErrorMessage !== ''"
            :message="rvvupErrorMessage"
          />
          <AdyenDropIn />
          <RvvupPayByBank v-if="rvvupPaymentsActive" />
        </template>
        <FreePayment v-else />
      </div>
    </div>
  </div>
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import usePaymentStore from '@/stores/PaymentStore';
import useGtmStore from '@/stores/GtmStore';

// components
import SavedDeliveryAddress from
  '@/components/Steps/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import AdyenDropIn from '@/components/Adyen/DropIn/DropIn.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';
import Rewards from '@/components/Core/Rewards/Rewards.vue';
import FreePayment from '@/components/Core/FreePayment/FreePayment.vue';
import StoreCredit from '@/components/Core/StoreCredit/StoreCredit.vue';
import RvvupPayByBank from '@/components/Steps/PaymentPage/Rvvup/PayByBank/PayByBank.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';

export default {
  name: 'PaymentPage',
  components: {
    SavedDeliveryAddress,
    SavedShippingMethod,
    AdyenDropIn,
    Rewards,
    FreePayment,
    RvvupPayByBank,
    ErrorMessage,
    StoreCredit,
  },
  computed: {
    ...mapState(useConfigStore, ['storeCode', 'rewardsEnabled', 'rvvupPaymentsActive']),
    ...mapState(usePaymentStore, ['rvvupErrorMessage']),
    ...mapState(useCartStore, ['cartGrandTotal', 'isItemRequiringDelivery']),
  },
  methods: {
    ...mapActions(useCartStore, ['getCart', 'getCartData']),
    ...mapActions(useConfigStore, ['getStoreConfig', 'getRvvupConfig']),
    ...mapActions(useGtmStore, ['trackStep']),
    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('details-active');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
