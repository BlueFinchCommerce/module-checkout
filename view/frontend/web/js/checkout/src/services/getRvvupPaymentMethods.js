import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';

import authenticatedRequest from '@/services/authenticatedRequest';

import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';

export default () => {
  const { customer: { tokenType } } = useCustomerStore();
  const { maskedId } = useCartStore();

  /**
   * For logged-in customers use: GET /V1/rvvup/vue-config/mine
   * For guests use: GET /V1/rvvup/vue-config/:quoteId
   */

  const guestUrl = `${getBaseRestUrl()}/rvvup/vue-config/${maskedId}`;
  const authUrl = `${getBaseRestUrl()}/rvvup/vue-config/mine`;

  const request = tokenType === tokenTypes.guestUser
    ? authenticatedRequest().get(guestUrl)
    : authenticatedRequest().get(authUrl);

  return request.then((response) => response.data);
};
