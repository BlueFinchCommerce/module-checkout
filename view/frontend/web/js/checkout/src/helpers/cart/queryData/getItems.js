import functionExtension from '@/extensions/functionExtension';

export default async () => {
  // Initialize the gift_wrapping query part based on Magento edition
  let giftWrappingQuerySimple = '';
  let giftWrappingQueryBundle = '';
  let giftWrappingQuery = '';
  let giftCardItemQuery = '';

  if (window.geneCheckout && window.geneCheckout.magentoEdition !== 'Community') {
    giftWrappingQuerySimple = `
    ... on SimpleCartItem {
        gift_wrapping {
          price {
            value
          }
        }
      }
    `;

    giftWrappingQueryBundle = `
    ... on BundleCartItem {
        gift_wrapping {
          price {
            value
          }
        }
      }
    `;

    giftWrappingQuery = `
       gift_wrapping {
         price {
           value
         }
       }
    `;

    giftCardItemQuery = `
     ... on GiftCardCartItem {
        recipient_name
        sender_name
        message
        amount {
          value
        }
      }
    `;
  }

  // Build the full cart items query string
  const items = `
    items {
      __typename
      id
      uid
      ${giftWrappingQuerySimple}
      ${giftWrappingQueryBundle}
      ... on ConfigurableCartItem {
        configurable_options {
          option_label
          value_label
        }
        ${giftWrappingQuery}
      }
      ${giftCardItemQuery}
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

  // Perform the function extension with the built query
  const [modifiedCart] = await functionExtension('getItems', [items]);

  return modifiedCart;
};
