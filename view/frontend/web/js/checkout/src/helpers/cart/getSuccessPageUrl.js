import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default () => {
  const { secureBaseUrl } = useConfigStore();
  return `${secureBaseUrl}checkout/onepage/success`;
};
