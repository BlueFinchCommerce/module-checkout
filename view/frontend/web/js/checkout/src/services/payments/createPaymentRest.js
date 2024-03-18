import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';

export default (payment) => (
  authenticatedRequest().post(buildCartUrl('payment-information'), payment)
    .then((response) => response.data)
);
