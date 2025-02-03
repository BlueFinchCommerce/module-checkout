import getStoreId from '@/helpers/storeConfigs/getStoreId';
import graphQlRequest from './graphQlRequest';

export default () => {
  const storeId = getStoreId();
  const request = `{
    storecode(store_id: "${storeId}") {
        store_code
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutStoreCode')
    .then((response) => response.data?.storecode?.store_code);
};
