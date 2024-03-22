import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default () => (
  authenticatedRequest().get(buildCartUrl('totals'))
    .then((response) => response.data)
);
