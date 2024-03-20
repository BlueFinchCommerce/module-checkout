import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';
import handleServiceError from '@/helpers/handleServiceError';
import authenticatedRequest from '@/services/authenticatedRequest';
import useCustomerStore from '@/stores/CustomerStore';

export default () => {
  const { customer: { token, tokenType } } = useCustomerStore();
  const builtPath = tokenType === tokenTypes.guestUser
    ? `${getBaseRestUrl()}/checkout/${token}/data`
    : `${getBaseRestUrl()}/checkout/mine/data`;

  return authenticatedRequest().get(builtPath)
    .then((response) => JSON.parse(response.data))
    .then((response) => response.result)
    .catch(handleServiceError);
};
