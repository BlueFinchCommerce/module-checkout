import useConfigStore from '@/stores/ConfigStore';
import getBaseUrl from './getBaseUrl';

export default () => {
  const { storeCode } = useConfigStore();
  return `${getBaseUrl()}/rest/${storeCode}/V1`;
};
