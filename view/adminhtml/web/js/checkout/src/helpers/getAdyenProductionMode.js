import useConfigStore from '@/stores/ConfigStore';

export default () => {
  const { adyenEnvironmentMode } = useConfigStore();
  return adyenEnvironmentMode === 'live';
};
