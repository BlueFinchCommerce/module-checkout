export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache?.cart?.paymentMethodList?.length) {
    return [];
  }

  return mageCache.cart.paymentMethodList;
};
