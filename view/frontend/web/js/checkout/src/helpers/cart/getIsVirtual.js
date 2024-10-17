export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache?.cart?.items?.length) {
    return false;
  }

  return !mageCache.cart.items.some(({ product_type: productType }) => productType !== 'virtual');
};
