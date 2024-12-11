import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const giftWrapping = `
    gift_wrapping {
      price {
        value
      }
    }
  `;

  const [modifiedCart] = await functionExtension('getGiftWrapping', [giftWrapping]);

  return modifiedCart;
};
