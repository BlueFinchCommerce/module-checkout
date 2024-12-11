import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const paymentMethods = `
    available_payment_methods {
      code
      title
    }
    selected_payment_method {
      code
      title
    }
  `;

  const [modifiedCart] = await functionExtension('getPaymentMethods', [paymentMethods]);

  return modifiedCart;
};
