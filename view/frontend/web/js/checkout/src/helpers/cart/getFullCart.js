import useCustomerStore from '@/stores/CustomerStore';

export default () => {
  const customerStore = useCustomerStore();

  return `
    email
    applied_gift_cards {
      code
      expiration_date
      current_balance {
        currency
        value
      }
      applied_balance {
        currency
        value
      }
    }
    billing_address {
      city
      country {
        code
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
        carrier_code
        carrier_title
        method_code
        method_title
      }
    }
    items {
      __typename
      id
      uid
      ... on SimpleCartItem {
        gift_wrapping {
          price {
            value
          }
        }
      }
      ... on BundleCartItem {
        gift_wrapping {
          price {
            value
          }
        }
      }
      ... on ConfigurableCartItem {
        configurable_options {
          option_label
          value_label
        }
        gift_wrapping {
          price {
            value
          }
        }
      }
      ... on GiftCardCartItem {
        recipient_name
        sender_name
        message
        amount {
          value
        }
      }
      product {
        name
        sku
        id
        thumbnail {
          url
          label
        }
        price_range {
          minimum_price {
            final_price {
              value
            }
          }
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
    gift_wrapping {
      price {
        value
      }
    }
    applied_reward_points {
      points
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
    is_virtual
    ${customerStore.isLoggedIn
    ? `applied_store_credit {
          applied_balance {
            value
            currency
          }
        }`
    : ''}
  `;
};
