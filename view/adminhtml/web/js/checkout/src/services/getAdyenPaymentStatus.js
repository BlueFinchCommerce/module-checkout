import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import getAdyenAuthenticatedRequest from '@/services/getAdyenAuthenticatedRequest';

export default (orderId) => {
  const method = 'post';
  const url = `${getBaseRestUrl()}/adyen/orders/payment-status`;
  const params = {
    orderId,
  };
  return getAdyenAuthenticatedRequest(method, url, params)
    .then((response) => response.data)
    .then((data) => JSON.parse(data));
};
