export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache.cart.items) {
    return [];
  }
  return mageCache.cart.items.map((item) => {
    return {
      ...item,
      quantity: item.qty,
      product: {
        name: item.product_name,
        price_range: {
          minimum_price: {
            final_price: {
              value: item.product_price_value
            },
          },
        },
        thumbnail: {
          url: item.product_image.src,
        },
        giftMessage: {},
      },
    }
  }).sort((a, b) => (
    parseInt(a.item_id, 10) - parseInt(b.item_id, 10)
  ));
};
