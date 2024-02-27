export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  return mageCache && mageCache.cart && mageCache.cart.items
    ? mageCache.cart.items.reduce((prev, curr) => {
      const newItems = prev;
      newItems[curr.item_id] = {
        image: curr.product_image,
        name: curr.product_name,
        price: curr.product_price_value,
        price_incl_tax: curr.product_price_value,
        ...curr,
      };
      return newItems;
    }, {})
    : {};
};
