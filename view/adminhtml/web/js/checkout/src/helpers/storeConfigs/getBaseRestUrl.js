import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import getBaseUrl from './getBaseUrl';

export default () => {
  const { storeCode } = useConfigStore();
  return `${getBaseUrl()}/rest/${storeCode}/V1`;
};
