import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (file) => {
  const { location: { hostname } } = window;
  const { staticUrl } = useConfigStore();
  const { staticPath } = window.bluefinchCheckout;

  if (staticUrl || staticPath) {
    if (hostname === 'localhost') {
      return file;
    }

    return staticPath
      ? staticPath + file
      : staticUrl + file;
  }
  return file;
};
