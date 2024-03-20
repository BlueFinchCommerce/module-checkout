export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  return mageCache && mageCache.cart && mageCache.cart.currencyCode
    ? mageCache.cart.currencyCode
    : undefined;
};
