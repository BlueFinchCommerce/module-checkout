<template>
  <div class="order-summary-desktop">
    <OrderSummaryTotal/>
    <div class="order-summary-desktop-items">
      <OrderSummaryItem/>
    </div>
    <PromotionComponent />
    <GiftCardDiscount />
    <CouponDiscount />
  </div>
</template>
<script>
import OrderSummaryTotal from '@/components/Steps/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.vue';
import OrderSummaryItem from '@/components/Steps/OrderSummary/OrderSummaryItem/OrderSummaryItem.vue';
import PromotionComponent from '@/components/Steps/OrderSummary/PromotionComponent/PromotionComponent.vue';
import GiftCardDiscount from '@/components/Steps/OrderSummary/GiftCardDiscount/GiftCardDiscount.vue';
import CouponDiscount from '@/components/Steps/OrderSummary/CouponDiscount/CouponDiscount.vue';

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
