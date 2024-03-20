import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default (cartItem) => (
  authenticatedRequest().post(buildCartUrl('items'), {
    cartItem,
  }).then((response) => response.data)
);
