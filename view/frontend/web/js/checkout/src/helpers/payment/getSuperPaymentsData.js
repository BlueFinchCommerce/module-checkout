import authenticatedRequest from '@/services/authenticatedRequest';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';

export default () => {
  const requestUrl = `${getBaseUrl()}/superpayment/discount/offerbanner`;
  
  const request = authenticatedRequest().post(requestUrl);
  
  return request.then((response) => response.data);
};
