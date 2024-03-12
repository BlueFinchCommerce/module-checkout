import useCartStore from '@/stores/CartStore';
import graphQlRequest from './graphQlRequest';

export default (email) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setGuestEmailOnCart(input: {
        cart_id: "${maskedId}"
        email: "${email}"
      }) {
        cart {
          id
        }
      }
    }`;

  return graphQlRequest(request);
};
