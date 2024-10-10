import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const prices = `
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

  const [modifiedCart] = await functionExtension('getPrices', [prices]);

  return modifiedCart;
};
