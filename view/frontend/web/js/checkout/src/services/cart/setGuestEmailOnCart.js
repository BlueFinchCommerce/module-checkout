import useCartStore from '@/stores/CartStore';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';

export default async (email) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setGuestEmailOnCart(
        input: {
          cart_id: "${maskedId}"
          email: "${email}"
        }
      ) {
        cart {
          email
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response => response.data.setGuestEmailOnCart.cart));
};
