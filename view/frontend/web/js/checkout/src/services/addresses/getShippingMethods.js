import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import graphQlRequest from '@/services/graphQlRequest';
import formatAddress from '@/helpers/addresses/formatAddress';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

import functionExtension from '@/extensions/functionExtension';

const convertBoolean = (value) => (value === 1);

const mapToGraphQLString = (obj) => Object.entries(obj)
  .map(([key, value]) => (value ? `${key}: ${JSON.stringify(value)}` : ''))
  .join(', ');

const buildShippingAddressMutation = async (cartId, formattedAddressGraphQL) => `
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
      ${await getShippingAddresses()}
    }
  }
}`;

export default async (shippingAddress, paymentMethod = null, express = false) => {
  const { maskedId, getMaskedId } = useCartStore();
  const formattedShippingAddress = formatAddress(shippingAddress);

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedId();
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
    country_code: formattedShippingAddress.country_code
      ? formattedShippingAddress.country_code : formattedShippingAddress.country.code,
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
  const request = await buildShippingAddressMutation(cartId, formattedAddressGraphQL);

  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return functionExtension('getShippingMethods', [
        response.data.setShippingAddressesOnCart.cart,
        paymentMethod,
        express,
      ]);
    })
    .then(([cart]) => cart);
};
