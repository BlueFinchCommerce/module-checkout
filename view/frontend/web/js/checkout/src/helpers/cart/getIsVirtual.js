export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache?.cart?.items?.length) {
    return false;
  }

  const virtualProductTypes = ['virtual', 'downloadable'];

  return mageCache.cart.items.every(({ product_type: productType }) => (
    virtualProductTypes.includes(productType)
  ));
};
