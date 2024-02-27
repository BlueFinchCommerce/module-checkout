import useConfigStore from '@/stores/ConfigStore';
import getBaseUrl from '@/helpers/getBaseUrl';
import authenticatedRequest from '@/services/authenticatedRequest';

export default (companyId) => {
  const { storeCode } = useConfigStore();
  const url = `${getBaseUrl()}/rest/${storeCode}/V1/carts/mine/hokodo-request-offer`;

  const data = {
    payload: {
      company_id: companyId,
    },
  };

  return authenticatedRequest().post(url, data)
    .then((response) => response.data)
    .catch((error) => (
      console.log(error)
    ));
};
