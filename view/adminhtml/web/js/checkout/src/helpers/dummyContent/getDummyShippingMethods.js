export default () => (
  [
    {
      amount: {
        currency: 'USD',
        value: 0,
      },
      available: true,
      carrier_code: 'freeshipping',
      carrier_title: '1 Working Day',
      error_message: '',
      method_code: 'freeshipping',
      method_title: 'Free Delivery',
      price_excl_tax: {
        value: 0,
        currency: 'USD',
      },
      price_incl_tax: {
        value: 0,
        currency: 'USD',
      },
    },
    {
      amount: {
        currency: 'USD',
        value: 10,
      },
      available: true,
      carrier_code: 'flatrate',
      carrier_title: '2-3 Working Days',
      error_message: '',
      method_code: 'flatrate',
      method_title: 'Standard Delivery',
      price_excl_tax: {
        value: 10,
        currency: 'USD',
      },
      price_incl_tax: {
        value: 10,
        currency: 'USD',
      },
    },
  ]
);
