import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default (itemId) => (
  authenticatedRequest().delete(buildCartUrl(`items/${itemId}`)).then((response) => response.data)
);
