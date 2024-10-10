import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';
import tokenTypes from '@/helpers/tokens/getTokenTypes';
import handleServiceError from '@/helpers/validation/handleServiceError';
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
