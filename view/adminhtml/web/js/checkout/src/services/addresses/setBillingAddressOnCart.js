import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';
import deepClone from '@/helpers/addresses/deepClone';

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join(', ');

export default async (billingAddress) => {
  const { maskedId } = useCartStore();

  const tempBillingAddress = deepClone(billingAddress);

  delete tempBillingAddress.id;
  delete tempBillingAddress.email;
  delete tempBillingAddress.editing;
  delete tempBillingAddress.country_id;
  delete tempBillingAddress.same_as_billing;
  delete tempBillingAddress.region_code;
  tempBillingAddress.region = tempBillingAddress.region_id;
  delete tempBillingAddress.region_id;
  delete tempBillingAddress.same_as_shipping;
  delete tempBillingAddress.default_billing;
  delete tempBillingAddress.default_shipping;

  tempBillingAddress.save_in_address_book = !!tempBillingAddress.save_in_address_book;

  const request = `
    mutation {
      setBillingAddressOnCart(
        input: {
          cart_id: "${maskedId}"
          billing_address: {
            address: { ${mapToGraphQLString(tempBillingAddress)} }
          }
        }
      ) {
        cart {
          ${getFullCart()}
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.setBillingAddressOnCart;
    });
};
