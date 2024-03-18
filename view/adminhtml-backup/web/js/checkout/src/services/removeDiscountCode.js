import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default () => (
  authenticatedRequest().delete(buildCartUrl('coupons/')).then((response) => response.data)
);
