export default () => (
  [
    {
      firstname: 'Gene',
      lastname: 'Commerce',
      street: [
        '20 Middle St',
      ],
      city: 'Brighton and Hove',
      postcode: 'BN1 1AL',
      region: {
        code: 'undefined',
        label: 'undefined',
      },
      country: {
        code: 'GB',
        label: 'GB',
      },
      telephone: '01273 030390',
      available_shipping_methods: [
        {
          amount: {
            currency: 'USD',
            value: 0,
          },
          available: true,
          carrier_code: 'freeshipping',
          carrier_title: 'Free Shipping',
          error_message: '',
          method_code: 'freeshipping',
          method_title: 'Free',
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
          carrier_title: 'Flat Rate',
          error_message: '',
          method_code: 'flatrate',
          method_title: 'Fixed',
          price_excl_tax: {
            value: 10,
            currency: 'USD',
          },
          price_incl_tax: {
            value: 10,
            currency: 'USD',
          },
        },
      ],
      selected_shipping_method: {
        amount: {
          value: 0,
          currency: 'USD',
        },
        carrier_code: 'freeshipping',
        carrier_title: 'Free Shipping',
        method_code: 'freeshipping',
        method_title: 'Free',
      },
    },
  ]
);
