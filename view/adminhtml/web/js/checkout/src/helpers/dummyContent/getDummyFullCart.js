import giftCard from '@/icons/products/gift-card.jpg';
import jackshirt from '@/icons/products/jackshirt.jpg';
import shoulder from '@/icons/products/shoulder.jpg';

export default () => [
  {
    email: 'hello@gene.co.uk',
    applied_gift_cards: [
      {
        code: '035K7XUJDOWJ',
        expiration_date: null,
        current_balance: {
          currency: 'USD',
          value: 10,
        },
        applied_balance: {
          currency: 'USD',
          value: 10,
        },
      },
    ],
    billing_address: {
      city: 'Brighton and Hove',
      country: {
        code: 'GB',
        label: 'GB',
      },
      firstname: 'Gene',
      lastname: 'Commerce',
      postcode: 'BN1 1AL',
      region: {
        code: null,
        label: null,
      },
      street: [
        '20 Middle St',
      ],
      telephone: '01273030390',
    },
    shipping_addresses: [
      {
        firstname: 'Gene',
        lastname: 'Commerce',
        street: [
          '20 Middle St',
        ],
        city: 'Brighton and Hove',
        postcode: 'BN1 1AL',
        region: {
          code: null,
          label: null,
        },
        country: {
          code: 'GB',
          label: 'GB',
        },
        telephone: '01273030390',
        available_shipping_methods: [
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
        ],
        selected_shipping_method: {
          amount: {
            value: 10,
            currency: 'USD',
          },
          carrier_code: 'flatrate',
          carrier_title: '2-3 Working Days',
          method_code: 'flatrate',
          method_title: 'Standard Delivery',
        },
      },
    ],
    items: [
      {
        __typename: 'ConfigurableCartItem',
        id: '168',
        uid: 'MTY4',
        configurable_options: [
          {
            option_label: 'Size',
            value_label: 'M',
          },
          {
            option_label: 'Color',
            value_label: 'Blue',
          },
        ],
        gift_wrapping: null,
        product: {
          name: 'Proteus Fitness Jackshirt',
          sku: 'MJ12',
          id: 430,
          thumbnail: {
            url: jackshirt,
            label: 'Proteus Fitness Jackshirt',
          },
          price_range: {
            minimum_price: {
              final_price: {
                value: 45,
              },
            },
          },
        },
        quantity: 1,
        errors: null,
      },
      {
        __typename: 'GiftCardCartItem',
        id: '170',
        uid: 'MTcw',
        recipient_name: 'Better Checkout',
        recipient_email: 'better@gene.co.uk',
        sender_name: 'Gene Commerce',
        sender_email: 'hello@gene.co.uk',
        message: 'Thanks for using Better Checkout',
        amount: {
          value: 25,
        },
        product: {
          name: 'Luma Virtual Gift Card',
          sku: '243-MB09',
          id: 2042,
          thumbnail: {
            url: giftCard,
            label: 'Luma Virtual Gift Card',
          },
          price_range: {
            minimum_price: {
              final_price: {
                value: 25,
              },
            },
          },
        },
        quantity: 1,
        errors: null,
      },
      {
        __typename: 'SimpleCartItem',
        id: '171',
        uid: 'MTcx',
        gift_wrapping: null,
        product: {
          name: 'Strive Shoulder Pack',
          sku: '24-MB04',
          id: 2,
          thumbnail: {
            url: shoulder,
            label: 'Strive Shoulder Pack',
          },
          price_range: {
            minimum_price: {
              final_price: {
                value: 32,
              },
            },
          },
        },
        quantity: 1,
        errors: null,
      },
    ],
    available_payment_methods:
        [
          {
            code: 'checkmo',
            title: 'Check / Money order',
          },
          {
            code: 'braintree',
            title: 'Credit Card',
          },
          {
            code: 'braintree_cc_vault',
            title: 'Stored Cards',
          },
          {
            code: 'braintree_paypal_vault',
            title: 'Stored Accounts (PayPal)',
          },
          {
            code: 'braintree_applepay',
            title: 'Apple Pay',
          },
          {
            code: 'braintree_googlepay',
            title: 'Google Pay',
          },
          {
            code: 'braintree_venmo',
            title: 'Venmo',
          },
          {
            code: 'braintree_ach_direct_debit',
            title: 'ACH Direct Debit',
          },
          {
            code: 'braintree_local_payment',
            title: 'Local Payments',
          },
          {
            code: 'braintree_local_payment',
            title: 'Local Payments',
          },
          {
            code: 'braintree_paypal',
            title: 'PayPal',
          },
          {
            code: 'adyen_hpp',
            title: 'Alternative payment methods',
          },
        ],
    selected_payment_method: {
      code: '',
      title: '',
    },
    applied_coupons: null,
    gift_wrapping: null,
    applied_reward_points: null,
    prices: {
      grand_total: {
        value: 92,
        currency: 'USD',
      },
      subtotal_including_tax: {
        value: 102,
        currency: 'USD',
      },
      subtotal_excluding_tax: {
        value: 102,
        currency: 'USD',
      },
      discounts: [
        {
          amount: {
            value: 10,
            currency: 'USD',
          },
          label: 'Gift Cards',
        },
      ],
    },
    is_virtual: false,
  },
];
