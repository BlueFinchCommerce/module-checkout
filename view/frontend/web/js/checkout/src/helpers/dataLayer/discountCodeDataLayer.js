import useGtmStore from '@/stores/ConfigStores/GtmStore';
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
    let label = '';
    let value = 0;
    if (prices.discounts?.length) {
      label = prices.discounts[0]?.label ?? '';
      value = prices.discounts[0]?.amount?.value ?? 0;
    }

    gtmStore.trackGtmEvent({
      event: type,
      discountCode: code,
      dicountTitle: label,
      discountAmount: value,
    });
  }
};
