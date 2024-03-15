import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';

export default (quoteId) => (
  authenticatedRequest().get(buildCartUrl('items'), {
    quoteId,
  }).then((response) => response.data)
);
