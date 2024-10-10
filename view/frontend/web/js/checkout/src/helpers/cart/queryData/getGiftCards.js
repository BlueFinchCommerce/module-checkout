import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const giftCards = `
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
  `;

  const [modifiedCart] = await functionExtension('getGiftCards', [giftCards]);

  return modifiedCart;
};
