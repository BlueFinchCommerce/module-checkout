import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useCartStore from '@/stores/CartStore';

export default (type) => {
  const gtmStore = useGtmStore();
  const {
    cart: {
      applied_gift_cards: appliedGiftCards,
    },
  } = useCartStore();

  if (appliedGiftCards?.length) {
    const {
      code,
      applied_balance: { value },
    } = appliedGiftCards[0];

    gtmStore.trackGtmEvent({
      event: type,
      giftCardCode: code,
      giftCardValue: value,
    });
  }
};
