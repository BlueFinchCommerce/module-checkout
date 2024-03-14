import useGtmStore from '@/stores/GtmStore';
import useCartStore from '@/stores/CartStore';

export default (type) => {
  const gtmStore = useGtmStore();
  const {
    cart: {
      applied_gift_cards: appliedGiftCards,
      prices,
    },
  } = useCartStore();

  if (appliedGiftCards?.length) {
    const { code } = appliedGiftCards[0];
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
