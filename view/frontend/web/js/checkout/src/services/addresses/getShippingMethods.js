import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';
import formatAddress from '@/helpers/formatAddress';

const convertBoolean = (value) => (value === 1);

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join(', ');

const buildShippingAddressMutation = (cartId, formattedAddressGraphQL) => `
mutation {
  setShippingAddressesOnCart(
    input: {
      cart_id: "${cartId}"
      shipping_addresses: [
        {
          address: { ${formattedAddressGraphQL} }
        }
      ]
    }
  ) {
    cart {
      shipping_addresses {
        firstname
        lastname
        company
        street
        city
        region {
          code
          label
        }
        postcode
        telephone
        country {
          code
          label
        }
        available_shipping_methods {
          carrier_code
          carrier_title
          method_code
          method_title
          amount {
            value
          }
          available
          error_message
          price_excl_tax {
            value
          }
          price_incl_tax {
            value
          }
        }
      }
    }
  }
}`;

const mapShippingMethods = (response) => (
  response.data.setShippingAddressesOnCart
    ? response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods
    : []
);

export default async (shippingAddress) => {
  const { maskedId } = useCartStore();
  const formattedShippingAddress = formatAddress(shippingAddress);

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedIdFromGraphQl();
  } else {
    cartId = maskedId;
  }

  const formattedAddress = {
    firstname: formattedShippingAddress.firstname,
    lastname: formattedShippingAddress.lastname,
    company: formattedShippingAddress.company,
    street: formattedShippingAddress.street,
    city: formattedShippingAddress.city,
    region: formattedShippingAddress.region,
    region_id: formattedShippingAddress.region_id || null,
    postcode: formattedShippingAddress.postcode,
    country_code: formattedShippingAddress.country_code,
    telephone: formattedShippingAddress.telephone,
    save_in_address_book: convertBoolean(formattedShippingAddress.save_in_address_book),
  };

  // Check if the region is a name and retrieve the corresponding code
  const { countries } = useConfigStore();
  const foundCountry = countries.find((country) => country.two_letter_abbreviation
    === formattedShippingAddress.country_code);

  if (foundCountry && foundCountry.available_regions) {
    const foundRegion = foundCountry.available_regions.find((region) => region.name
      === formattedShippingAddress.region);
    if (foundRegion) {
      formattedAddress.region = foundRegion.code;
    }
  }

  const formattedAddressGraphQL = mapToGraphQLString(formattedAddress);
  const request = buildShippingAddressMutation(cartId, formattedAddressGraphQL);

  return graphQlRequest(request).then(mapShippingMethods);
};
