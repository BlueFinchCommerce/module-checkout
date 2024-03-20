import useConfigStore from '@/stores/ConfigStore';

export default () => {
  const { secureBaseUrl } = useConfigStore();
  return `${secureBaseUrl}checkout/onepage/success`;
};
