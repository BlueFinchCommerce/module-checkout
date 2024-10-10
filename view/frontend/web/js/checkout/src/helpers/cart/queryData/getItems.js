import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const items = `
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
      prices {
        row_total {
          value
        }
        row_total_including_tax {
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
        special_price
        ... on SimpleProduct {
          weight
        }
      }
      quantity
      errors {
        code
        message
      }
    }
  `;

  const [modifiedCart] = await functionExtension('getItems', [items]);

  return modifiedCart;
};
