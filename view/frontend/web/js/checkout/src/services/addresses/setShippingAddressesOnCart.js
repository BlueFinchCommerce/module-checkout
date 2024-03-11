import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';
import formatAddress from '@/helpers/formatAddress';
import getFullCart from '@/helpers/getFullCart';

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join(', ');

export default async (shippingAddress) => {
  const { maskedId } = useCartStore();

  delete shippingAddress.id;
  delete shippingAddress.email;
  delete shippingAddress.editing;
  delete shippingAddress.country_id;
  delete shippingAddress.same_as_billing;
  delete shippingAddress.region_code;
  shippingAddress.region = shippingAddress.region_id;
  delete shippingAddress.region_id;

  shippingAddress.save_in_address_book = !!shippingAddress.save_in_address_book;

  const request = `
    mutation {
      setShippingAddressesOnCart(
        input: {
          cart_id: "${maskedId}"
          shipping_addresses: [
            {
              address: { ${mapToGraphQLString(shippingAddress)} }
            }
          ]
        }
      ) {
        cart {
          ${getFullCart}
        }
      }
    }`;

  return graphQlRequest(request);
};
