import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

export default (coupon) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyCouponToCart(input: {
        cart_id: "${maskedId}"
        coupon_code: "${coupon}"
      }) {
        cart {
          shipping_addresses {
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
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
        return;
      }

      return response.data.applyCouponToCart.cart;
    });
};
