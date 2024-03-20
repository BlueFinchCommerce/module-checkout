import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default (itemId, sku, qty, quoteId) => (
  authenticatedRequest().put(buildCartUrl(`items/${itemId}`), {
    cartItem: {
      sku,
      qty,
      quoteId,
    },
  }).then((response) => response.data)
);
