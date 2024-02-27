import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';
import authenticatedRequest from '@/services/authenticatedRequest';
import getAdyenAuthenticatedRequest from '@/services/getAdyenAuthenticatedRequest';
import useCustomerStore from '@/stores/CustomerStore';

export default (payload) => {
  const { customer: { tokenType } } = useCustomerStore();

  const guestUrl = `${getBaseRestUrl()}/adyen/paymentDetails`;
  const authUrl = `${getBaseRestUrl()}/internal/adyen/paymentDetails`;

  const request = tokenType === tokenTypes.guestUser
    ? getAdyenAuthenticatedRequest('post', guestUrl, { payload })
    : authenticatedRequest().post(authUrl, { formKey: '', payload });

  return request.then((response) => response.data)
    .then((data) => JSON.parse(data));
};
