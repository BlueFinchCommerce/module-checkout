import authenticatedRequest from '@/services/authenticatedRequest';

export default () => (
  authenticatedRequest().get('customers/me')
    .then((response) => response.data.addresses)
);
