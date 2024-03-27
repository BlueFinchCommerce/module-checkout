import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default () => {
  const { secureBaseLinkUrl } = useConfigStore();
  return `${secureBaseLinkUrl}checkout/onepage/success`;
};
