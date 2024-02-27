import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default () => (
  authenticatedRequest().get(buildCartUrl('items'))
    .then((response) => response.data)
);
