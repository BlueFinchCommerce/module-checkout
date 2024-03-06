import useAdyenStore from '@/stores/AdyenStore';

export default () => {
  const { adyenEnvironmentMode } = useAdyenStore();
  return adyenEnvironmentMode === 'live';
};
