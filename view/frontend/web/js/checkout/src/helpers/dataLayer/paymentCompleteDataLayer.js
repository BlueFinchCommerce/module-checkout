import useGtmStore from '@/stores/GtmStore';

export default () => {
  const gtmStore = useGtmStore();
  gtmStore.trackGtmEvent({
    event: 'paymentComplete',
  });
};
