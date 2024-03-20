import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';

import authenticatedRequest from '@/services/authenticatedRequest';

import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';

export default () => {
  const { customer: { tokenType } } = useCustomerStore();
  const { id, maskedId } = useCartStore();

  const guestUrl = `${getBaseRestUrl()}/rvvup/payments/${maskedId}/payment-actions`;
  const authUrl = `${getBaseRestUrl()}/rvvup/payments/mine/${id}/payment-actions`;

  const payload = {};

  const request = tokenType === tokenTypes.guestUser
    ? authenticatedRequest().get(guestUrl, { payload })
    : authenticatedRequest().get(authUrl, { payload });

  return request.then((response) => response.data);
};
