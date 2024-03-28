import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';
import deepClone from '@/helpers/addresses/deepClone';

const formatAddress = (address) => {
  if (!address) {
    return address;
  }

  const clonedAddress = deepClone(address);

  // Format region.
  clonedAddress.region_id = clonedAddress.region.region_id;
  clonedAddress.region = clonedAddress.region.region_code || clonedAddress.region.region;

  if (!clonedAddress.region_id) {
    delete clonedAddress.region_id;
  }

  if (!clonedAddress.region) {
    delete clonedAddress.region;
  }

  delete clonedAddress.id;
  delete clonedAddress.email;
  delete clonedAddress.editing;
  delete clonedAddress.country_id;
  delete clonedAddress.same_as_billing;
  delete clonedAddress.same_as_shipping;
  delete clonedAddress.region_code;
  delete clonedAddress.default_shipping;
  delete clonedAddress.default_billing;
  delete clonedAddress.country;
  delete clonedAddress.available_shipping_methods;
  delete clonedAddress.save_in_address_book;
  delete clonedAddress.selected_shipping_method;

  clonedAddress.save_in_address_book = !!clonedAddress.save_in_address_book;

  return clonedAddress;
};

export default async (shippingAddress, billingAddress, email = false) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation SetAddresses(
      $cartId: String!,

      ${shippingAddress && shippingAddress.firstname ? `
        $shippingAddresses: [ShippingAddressInput]!,
        ` : ''}

      $billingAddress: BillingAddressInput!
      ${email ? '$email: String!' : ''}
    ) {

      ${email ? `
        setGuestEmailOnCart(
          input: {
            cart_id: $cartId
            email: $email
          }
        ) {
          cart {
            id
          }
        }` : ''}

      ${shippingAddress && shippingAddress.firstname ? `
        setShippingAddressesOnCart(
          input: {
            cart_id: $cartId
            shipping_addresses: $shippingAddresses
          }
        ) {
          cart {
            id
          }
        }` : ''}

      setBillingAddressOnCart(
        input: {
          cart_id: $cartId
          billing_address: $billingAddress
        }
      ) {
        cart {
          ${getFullCart()}
        }
      }
    }`;

  const variables = {
    cartId: maskedId,
    shippingAddresses: [{
      address: formatAddress(shippingAddress),
    }],
    billingAddress: {
      address: formatAddress(billingAddress),
    },
    ...(email ? { email } : {}),
  };

  return graphQlRequest(request, variables)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.setBillingAddressOnCart;
    });
};
