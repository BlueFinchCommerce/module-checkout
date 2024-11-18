<template>
  <div class="order-summary-desktop">
    <PromotionComponent :data-cy="deviceType" />
    <CouponDiscount :data-cy="deviceType" />
    <GiftCardDiscount v-if="giftCardAvailable"
                      :data-cy="deviceType" />
    <div class="order-summary-desktop-items">
      <OrderSummaryItem :data-cy="deviceType"/>
    </div>
    <OrderSummaryTotal :data-cy="deviceType" />
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
  data() {
    return {
      deviceType: 'desktop',
      giftCardAvailable: true,
    };
  },
  created() {
    this.giftCardAvailable = window.geneCheckout
      && window.geneCheckout.magentoEdition !== 'Community';
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
