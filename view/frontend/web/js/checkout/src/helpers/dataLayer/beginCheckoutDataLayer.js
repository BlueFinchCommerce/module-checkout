import useGtmStore from '@/stores/GtmStore';

export default () => {
  const gtmStore = useGtmStore();
  let origin = 'checkout';

  if (document.referrer) {
    origin = document.referrer.includes('cart') ? 'cart' : 'minicart';
  }

  gtmStore.trackGtmEvent({
    event: 'beginCheckout',
    origin,
  });
};
