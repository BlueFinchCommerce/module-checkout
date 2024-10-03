import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const shippingAddresses = `
    shipping_addresses {
      firstname
      lastname
      street
      city
      postcode
      region {
        code
        label
      }
      country {
        code
      }
      telephone
      available_shipping_methods {
        amount {
          currency
          value
        }
        available
        carrier_code
        carrier_title
        error_message
        method_code
        method_title
        price_excl_tax {
          value
          currency
        }
        price_incl_tax {
          value
          currency
        }
      }
      selected_shipping_method {
        amount {
          value
          currency
        }
        price_incl_tax {
          value
          currency
        }
        carrier_code
        carrier_title
        method_code
        method_title
      }
    }
  `;

  const [modifiedCart] = await functionExtension('getShippingAddresses', [shippingAddresses]);

  return modifiedCart;
};
