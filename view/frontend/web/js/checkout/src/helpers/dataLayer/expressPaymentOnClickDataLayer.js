import useGtmStore from '@/stores/ConfigStores/GtmStore';

export default (resolve, reject, type) => {
  const gtmStore = useGtmStore();
  gtmStore.trackGtmEvent({
    event: 'expressPaymentInitiated',
    methodType: type,
  });
  resolve();
};
