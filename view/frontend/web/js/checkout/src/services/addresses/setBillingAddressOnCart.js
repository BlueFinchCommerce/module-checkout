import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';
import formatAddress from '@/helpers/formatAddress';

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join(', ');

export default async (billingAddress) => {
  const { maskedId } = useCartStore();

  delete billingAddress.id;
  delete billingAddress.email;
  delete billingAddress.editing;
  delete billingAddress.country_id;
  delete billingAddress.same_as_billing;
  delete billingAddress.region_code;
  billingAddress.region = billingAddress.region_id;
  delete billingAddress.region_id;
  delete billingAddress.same_as_shipping;

  billingAddress.save_in_address_book = !!billingAddress.save_in_address_book;

  const request = `
    mutation {
      setBillingAddressOnCart(
        input: {
          cart_id: "${maskedId}"
          billing_address: {
            address: { ${mapToGraphQLString(billingAddress)} }
          }
        }
      ) {
        cart {
          billing_address {
            city
            country {
              code
              label
            }
            firstname
            lastname
            postcode
            region {
              code
              label
            }
            street
            telephone
          }
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
        return;
      }

      return response.data.setBillingAddressOnCart;
    });
};
