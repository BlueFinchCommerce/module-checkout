import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default () => {
  const { secureBaseUrl, storeCode } = useConfigStore();
  return `${secureBaseUrl}${storeCode}/checkout/onepage/success`;
};
