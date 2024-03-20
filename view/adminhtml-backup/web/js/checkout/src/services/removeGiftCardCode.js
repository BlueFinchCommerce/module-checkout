import useCustomerStore from '@/stores/CustomerStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';
import tokenTypes from '@/helpers/getTokenTypes';

export default (code) => {
  const { customer: { tokenType } } = useCustomerStore();
  const prefix = tokenType === tokenTypes.guestUser
    ? '/carts'
    : '';

  return authenticatedRequest().delete(buildCartUrl(`giftCards/${code}`, prefix)).then((response) => response.data);
};
