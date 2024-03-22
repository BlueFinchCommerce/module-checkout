import useAdyenStore from '@/stores/PaymentStores/AdyenStore';

export default () => {
  const { adyenEnvironmentMode } = useAdyenStore();
  return adyenEnvironmentMode === 'live';
};
