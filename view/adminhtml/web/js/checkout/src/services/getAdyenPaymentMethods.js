import buildCartUrl from '@/helpers/buildCartUrl';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';
import authenticatedRequest from '@/services/authenticatedRequest';
import getAdyenAuthenticatedRequest from '@/services/getAdyenAuthenticatedRequest';
import useCustomerStore from '@/stores/CustomerStore';

export default () => {
  const { customer: { tokenType } } = useCustomerStore();

  const guestUrl = buildCartUrl('retrieve-adyen-payment-methods');
  const authUrl = `${getBaseRestUrl()}/internal/carts/mine/retrieve-adyen-payment-methods`;

  const request = tokenType === tokenTypes.guestUser
    ? getAdyenAuthenticatedRequest('post', guestUrl)
    : authenticatedRequest().post(authUrl, { formKey: '' });

  return request.then((response) => {
    const { paymentMethodsResponse } = JSON.parse(response.data);
    return paymentMethodsResponse;
  });
};
