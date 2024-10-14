export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache?.cart?.braintreeCcTypes?.length) {
    return [];
  }

  return mageCache.cart.braintreeCcTypes.map(({ value }) => value);
};
