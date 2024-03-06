export default () => (
  [
    {
      carrier_code: 'freeshipping',
      method_code: 'freeshipping',
      carrier_title: 'Free Shipping',
      method_title: 'Free',
      amount: 0,
      base_amount: 0,
      available: true,
      error_message: '',
      price_excl_tax: {
        value: 0,
      },
      price_incl_tax: {
        value: 0,
      },
    },
    {
      carrier_code: 'flatrate',
      method_code: 'flatrate',
      carrier_title: 'Flat Rate',
      method_title: 'Fixed',
      amount: 15,
      base_amount: 15,
      available: true,
      error_message: '',
      price_excl_tax: {
        value: 15,
      },
      price_incl_tax: {
        value: 15,
      },
    },
  ]
);
