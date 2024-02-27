import authenticatedRequest from '@/services/authenticatedRequest';

export default (postcode) => authenticatedRequest().get('/nominated-delivery', {
  address: {
    country_id: ' ', // Handled in the backend
    postcode,
  },
}).then((response) => response.data);
