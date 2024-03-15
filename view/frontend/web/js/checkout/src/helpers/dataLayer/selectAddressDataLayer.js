import useGtmStore from '@/stores/GtmStore';

export default (addressType) => {
  const gtmStore = useGtmStore();

  gtmStore.trackGtmEvent({
    event: 'selectAddress',
    addressType,
  });
};
