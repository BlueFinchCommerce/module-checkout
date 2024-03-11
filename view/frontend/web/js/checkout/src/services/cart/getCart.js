import useCartStore from '@/stores/CartStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/getFullCart';

export default () => {
  const { maskedId } = useCartStore();

  const request = `{
    cart(cart_id: "${maskedId}") {
      ${getFullCart}
    }
  }`;

  return graphQlRequest(request)
    .then((response) => response.data.cart);
  // authenticatedRequest().get(buildCartUrl('')).then((response) => response.data)
  //   .then((originalData) => {
  //     // If we have a customer and addresses then make sure all addresses have a company.
  //     const data = originalData;
  //     if (data?.customer?.addresses?.length) {
  //       data.customer.addresses = data.customer.addresses.map((address) => (
  //         {
  //           company: '',
  //           ...address,
  //         }
  //       ));
  //     }
  //     return data;
  //   })
};
