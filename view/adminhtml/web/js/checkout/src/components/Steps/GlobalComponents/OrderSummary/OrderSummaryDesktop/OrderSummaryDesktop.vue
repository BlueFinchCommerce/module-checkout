<template>
  <div class="order-summary-desktop">
    <PromotionComponent />
    <CouponDiscount />
    <GiftCardDiscount v-if="giftCardAvailable" />
    <div class="order-summary-desktop-items">
      <OrderSummaryItem/>
    </div>
    <OrderSummaryTotal/>
  </div>
</template>
<script>
import OrderSummaryTotal
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.vue';
import OrderSummaryItem from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/OrderSummaryItem.vue';
import PromotionComponent
  from '@/components/Steps/GlobalComponents/OrderSummary/PromotionComponent/PromotionComponent.vue';
import GiftCardDiscount from '@/components/Steps/GlobalComponents/OrderSummary/GiftCardDiscount/GiftCardDiscount.vue';
import CouponDiscount from '@/components/Steps/GlobalComponents/OrderSummary/CouponDiscount/CouponDiscount.vue';

// Helpers
import getMagentoSolutionType from '@/helpers/getMagentoSolutionType';

export default {
  name: 'OrderSummaryDesktop',
  components: {
    OrderSummaryTotal,
    OrderSummaryItem,
    PromotionComponent,
    GiftCardDiscount,
    CouponDiscount,
  },
  data() {
    return {
      giftCardAvailable: true,
    };
  },
  created() {
    this.giftCardAvailable = getMagentoSolutionType();
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
