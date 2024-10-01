import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getPartialCart from '@/helpers/cart/getPartialCart';

export default async (carrierCode, methodCode) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setShippingMethodsOnCart(
        input: {
          cart_id: "${maskedId}"
          shipping_methods: [
            {
              carrier_code: "${carrierCode}"
              method_code: "${methodCode}"
            }
          ]
        }
      ) {
        cart {
          ${await getPartialCart()}
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response) => response.data.setShippingMethodsOnCart.cart);
};
