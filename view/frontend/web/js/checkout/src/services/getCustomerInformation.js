import useCustomerStore from '@/stores/CustomerStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';

export default () => (
  authenticatedRequest().get(`${getBaseRestUrl()}/customers/me`)
    .then((response) => response.data)
    .catch(() => {
      // If this request fails we must be a guest User.
      const customerStore = useCustomerStore();
      customerStore.setData({
        customer: {
          tokenType: tokenTypes.guestUser,
        },
      });
    })
);
