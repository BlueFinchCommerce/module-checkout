export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache.cart) {
    return [];
  }

  return mageCache.cart.paymentMethodList.map((paymentMethod) => ({
    code: paymentMethod.code,
    title: paymentMethod.title,
  }));
};
