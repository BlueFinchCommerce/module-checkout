import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';
import formatAddress from '../helpers/formatAddress';

export default (shippingAddress) => {
  const formattedShippingAddress = formatAddress(shippingAddress);
  return authenticatedRequest().post(buildCartUrl('estimate-shipping-methods'), {
    address: formattedShippingAddress,
  }).then((response) => (
    response.data.length
      ? response.data.filter((shippingMethod) => shippingMethod.available)
      : []
  ));
};
