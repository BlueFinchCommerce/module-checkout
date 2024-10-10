import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default async (product) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      addSimpleProductsToCart(input: {
        cart_id: "${maskedId}"
        cart_items: [
          {
            data: {
              sku: "${product.sku}"
              quantity: "1"
              selected_options: []
              entered_options: []
            }
          }
        ]
      }) {
        cart {
          ${await getFullCart()}
        }
      }
    }`;
  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.addSimpleProductsToCart.cart;
    });
};
