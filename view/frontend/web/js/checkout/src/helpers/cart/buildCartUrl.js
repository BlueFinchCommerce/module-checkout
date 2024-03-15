import useCustomerStore from '@/stores/CustomerStore';
import tokenTypes from '@/helpers/tokens/getTokenTypes';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';

export default (path, prefix = '') => {
  const { customer: { token, tokenType } } = useCustomerStore();
  const builtPath = tokenType === tokenTypes.guestUser
    ? `/guest-carts/${token}/${path}`
    : `/carts/mine/${path}`;

  return `${getBaseRestUrl()}${prefix}${builtPath}`;
};
