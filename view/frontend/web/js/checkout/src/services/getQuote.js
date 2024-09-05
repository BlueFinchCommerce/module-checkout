import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';

export default () => (
  authenticatedRequest().get(buildCartUrl('')).then((response) => response.data)
);
