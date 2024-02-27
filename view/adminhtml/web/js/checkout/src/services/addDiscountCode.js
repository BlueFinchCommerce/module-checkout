import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default (code) => (
  authenticatedRequest().put(buildCartUrl(`coupons/${code}`)).then((response) => response.data)
);
