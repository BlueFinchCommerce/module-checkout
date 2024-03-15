import useGtmStore from '@/stores/ConfigStores/GtmStore';

export default (addressType) => {
  const gtmStore = useGtmStore();

  gtmStore.trackGtmEvent({
    event: 'selectAddress',
    addressType,
  });
};
