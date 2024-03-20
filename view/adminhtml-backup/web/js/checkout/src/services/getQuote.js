import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default (quoteId) => (
  authenticatedRequest().get(buildCartUrl('items'), {
    quoteId,
  }).then((response) => response.data)
);
