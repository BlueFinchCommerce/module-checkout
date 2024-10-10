import useGtmStore from '@/stores/ConfigStores/GtmStore';

export default (type) => {
  const gtmStore = useGtmStore();
  gtmStore.trackGtmEvent({
    event: 'expressPaymentInitiated',
    methodType: type,
  });
};
