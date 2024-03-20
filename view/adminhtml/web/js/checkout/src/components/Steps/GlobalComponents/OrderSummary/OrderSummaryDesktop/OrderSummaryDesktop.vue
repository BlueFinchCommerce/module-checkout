<template>
  <div class="order-summary-desktop">
    <CouponDiscount />
    <GiftCardDiscount />
    <div class="order-summary-desktop-items">
      <OrderSummaryItem/>
    </div>
    <OrderSummaryTotal/>
    <PromotionComponent />
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

export default {
  name: 'OrderSummaryDesktop',
  components: {
    OrderSummaryTotal,
    OrderSummaryItem,
    PromotionComponent,
    GiftCardDiscount,
    CouponDiscount,
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
