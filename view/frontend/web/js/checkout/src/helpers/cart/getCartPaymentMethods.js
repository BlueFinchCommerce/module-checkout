import getPaymentInformation from '@/services/payments/getPaymentInformation';

export default async () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache.cart) {
    return [];
  }
  let paymentMethods;
  if (mageCache.cart.paymentMethodList) {
    paymentMethods = mageCache.cart.paymentMethodList;
  } else {
    paymentMethods = await getPaymentInformation();
  }

  return paymentMethods.map((paymentMethod) => ({
    code: paymentMethod.code,
    title: paymentMethod.title,
  }));
};
