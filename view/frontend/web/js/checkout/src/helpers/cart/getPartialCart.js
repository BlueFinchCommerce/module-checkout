import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const partialCart = `
    id
    available_payment_methods {
      code
      title
    }
    selected_payment_method {
      code
      title
    }
    prices {
      grand_total {
        value
        currency
      }
      applied_taxes {
        label
        amount {
          value
          currency
        }
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
  `;

  const [modifiedCart] = await functionExtension('getPartialCart', [partialCart]);

  return modifiedCart;
};
