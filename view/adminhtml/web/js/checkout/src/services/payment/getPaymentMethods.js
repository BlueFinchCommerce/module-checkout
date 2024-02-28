import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default () => (
  authenticatedRequest().get(buildCartUrl('payment-methods'))
    .then((response) => response.data)
);
