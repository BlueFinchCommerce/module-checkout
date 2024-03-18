import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';
import deepClone from '@/helpers/addresses/deepClone';

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join(', ');

export default async (shippingAddress) => {
  const { maskedId } = useCartStore();

  const tempShippingAddress = deepClone(shippingAddress);

  delete tempShippingAddress.id;
  delete tempShippingAddress.email;
  delete tempShippingAddress.editing;
  delete tempShippingAddress.country_id;
  delete tempShippingAddress.same_as_billing;
  delete tempShippingAddress.region_code;
  tempShippingAddress.region = tempShippingAddress.region_id;
  delete tempShippingAddress.region_id;
  delete tempShippingAddress.default_shipping;
  delete tempShippingAddress.default_billing;

  tempShippingAddress.save_in_address_book = !!tempShippingAddress.save_in_address_book;

  const request = `
    mutation {
      setShippingAddressesOnCart(
        input: {
          cart_id: "${maskedId}"
          shipping_addresses: [
            {
              address: { ${mapToGraphQLString(tempShippingAddress)} }
            }
          ]
        }
      ) {
        cart {
          ${getFullCart()}
        }
      }
    }`;

  return graphQlRequest(request);
};
