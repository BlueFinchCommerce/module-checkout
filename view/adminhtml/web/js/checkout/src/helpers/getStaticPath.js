import useConfigStore from '@/stores/ConfigStore';

export default (file) => {
  const { location: { hostname } } = window;
  const { staticUrl } = useConfigStore();

  if (staticUrl) {
    return hostname === 'localhost'
      ? file
      : staticUrl + file;
  }
  return '';
};
