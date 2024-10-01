import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';

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
          ${await getFullCart()}
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response) => response.data.setShippingMethodsOnCart.cart);
};
