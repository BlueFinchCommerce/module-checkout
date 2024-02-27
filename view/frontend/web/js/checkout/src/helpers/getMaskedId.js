export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  return mageCache && mageCache.cart && mageCache.cart.guest_masked_id
    ? mageCache.cart.guest_masked_id
    : null;
};
