import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default () => {
  const { secureBaseLinkUrl, storeCode } = useConfigStore();
  return `${secureBaseLinkUrl}rest/${storeCode}/V1`;
};
