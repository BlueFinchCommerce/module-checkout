import useConfigStore from '@/stores/ConfigStore';

export default () => {
  const { afd } = useConfigStore();
  return afd.type === 'id'
    ? afd.idUrl
    : afd.serialUrl;
};
