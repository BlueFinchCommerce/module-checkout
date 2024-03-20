import giftCard from '@/icons/products/gift-card.jpg';
import jackshirt from '@/icons/products/jackshirt.jpg';
import shoulder from '@/icons/products/shoulder.jpg';

export default () => [
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
    message: '                        ',
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
            value: 0,
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
];
