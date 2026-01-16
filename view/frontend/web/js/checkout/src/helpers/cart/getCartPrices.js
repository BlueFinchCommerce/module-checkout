export default () => {
  const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));

  if (!mageCache.cart) {
    return {
      subtotalAmount: 0,
      grandTotalAmount: 0,
      grand_total: {
        value: 0,
        currency: undefined,
      },
      subtotal_including_tax: {
        value: 0,
        currency: undefined,
      },
      subtotal_excluding_tax: {
        value: 0,
        currency: undefined,
      },
      discounts: [],
    };
  }

  const { subtotalAmount, currencyCode } = mageCache.cart;

  return {
    subtotalAmount,
    grandTotalAmount: subtotalAmount,
    grand_total: {
      value: subtotalAmount,
      currency: currencyCode,
    },
    subtotal_including_tax: {
      value: subtotalAmount,
      currency: currencyCode,
    },
    subtotal_excluding_tax: {
      value: subtotalAmount,
      currency: currencyCode,
    },
    discounts: [],
  };
};
