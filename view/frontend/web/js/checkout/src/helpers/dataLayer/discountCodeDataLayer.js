import useGtmStore from '@/stores/GtmStore';
import useCartStore from '@/stores/CartStore';

export default (type) => {
  const gtmStore = useGtmStore();
  const {
    cart: {
      applied_coupons: appliedCoupons,
      prices,
    },
  } = useCartStore();

  if (appliedCoupons?.length) {
    const { code } = appliedCoupons[0];
    const { label } = prices.discounts[0];
    const { value } = prices.discounts[0].amount;

    gtmStore.trackGtmEvent({
      event: type,
      discountCode: code,
      dicountTitle: label,
      discountAmount: value,
    });
  }
};
