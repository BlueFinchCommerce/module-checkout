import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';

export default async (carrier_code, method_code) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setShippingMethodsOnCart(
        input: {
          cart_id: "${maskedId}"
          shipping_methods: [
            {
              carrier_code: "${carrier_code}"
              method_code: "${method_code}"
            }
          ]
        }
      ) {
        cart {
          email
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
          shipping_addresses {
            firstname
            lastname
            street
            city
            region {
              code
              label
            }
            country {
              code
              label
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
              carrier_code
              carrier_title
              method_code
              method_title
            }
          }
          items {
            id
            product {
              name
              sku
              thumbnail {
                url
              }
            }
            quantity
            errors {
              code
              message
            }
          }
          available_payment_methods {
            code
            title
          }
          selected_payment_method {
            code
            title
          }
          applied_coupons {
            code
          }
          prices {
            grand_total {
              value
              currency
            }
            subtotal_including_tax {
              value
              currency
            }
            subtotal_excluding_tax {
              value
              currency
            }
            discounts {
              amount {
                value
                currency
              }
              label
            }
          }
        }
      }
    }`;

  return graphQlRequest(request)
    .then((response => response.data.setShippingMethodsOnCart.cart));
};
