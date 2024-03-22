import useGtmStore from '@/stores/ConfigStores/GtmStore';

export default () => {
  const gtmStore = useGtmStore();

  gtmStore.trackGtmEvent({
    event: 'continueAsGuestUser',
  });
};
