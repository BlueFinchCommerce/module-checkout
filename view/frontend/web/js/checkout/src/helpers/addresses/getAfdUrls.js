import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default () => {
  const { addressFinder: { afd } } = useConfigStore();
  return afd.type === 'id'
    ? afd.idUrl
    : afd.serialUrl;
};
