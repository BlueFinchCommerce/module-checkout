import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import graphQlRequest from '@/services/graphQlRequest';
import deepClone from '@/helpers/addresses/deepClone';

import getEmailField from '@/helpers/cart/queryData/getEmailField';
import getBillingAddress from '@/helpers/cart/queryData/getBillingAddress';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

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

  // Preserving save_in_address_book before deletion
  const saveInAddressBook = clonedAddress.save_in_address_book;

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
  delete clonedAddress.isSavedAddressSelected;

  // Set save_in_address_book to a boolean value based on the preserved value
  clonedAddress.save_in_address_book = !!saveInAddressBook;

  return clonedAddress;
};

export default async (shippingAddress, billingAddress, email = false) => {
  const { maskedId, cart } = useCartStore();
  const { isLoggedIn } = useCustomerStore();

  const request = `
    mutation SetAddresses(
      $cartId: String!,
      ${!cart.is_virtual ? '$shippingAddresses: [ShippingAddressInput]' : ''},
      $billingAddress: BillingAddressInput!
      ${email && !isLoggedIn ? '$email: String!' : ''}
    ) {

      ${email && !isLoggedIn ? `
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

      setAddressesOnCart(
        input: {
          cart_id: $cartId
          ${!cart.is_virtual ? `
            shipping_addresses: $shippingAddresses
          ` : ''}
          billing_address: $billingAddress
        }
      ) {
        cart {
          ${await getEmailField()}

          ${await getBillingAddress()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
      }
    }`;

  const variables = {
    cartId: maskedId,
    billingAddress: {
      address: formatAddress(billingAddress),
    },
    ...(email ? { email } : {}),
  };

  if (!cart.is_virtual) {
    variables.shippingAddresses = [{
      address: formatAddress(shippingAddress),
    }];
  }
  return graphQlRequest(request, variables)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.setAddressesOnCart;
    });
};
