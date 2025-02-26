import authenticatedRequest from '@/services/authenticatedRequest';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';

export default (quoteId, customerId, storeId) => (
  authenticatedRequest().put(`${getBaseRestUrl()}/guest-carts/${quoteId}`, {
    customerId,
    storeId,
    cartId: quoteId,
  }).then((response) => response.data)
);
