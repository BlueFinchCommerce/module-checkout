import useGtmStore from '@/stores/GtmStore';

export default (type) => {
  const gtmStore = useGtmStore();
  gtmStore.trackGtmEvent({
    event: 'selectPaymentMethod',
    methodType: type,
  });
};
