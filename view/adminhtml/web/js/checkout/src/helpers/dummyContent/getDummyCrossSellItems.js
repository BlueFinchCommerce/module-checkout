import toneBand from '@/icons/products/duffle.jpg';
import yogaBrick from '@/icons/products/gift-card.jpg';
import foamRoll from '@/icons/products/jackshirt.jpg';
import yogaStrap from '@/icons/products/shoulder.jpg';

export default () => [
  {
    id: 18,
    __typename: 'SimpleProduct',
    name: 'Pursuit Lumaflex&trade; Tone Band',
    stock_status: 'IN_STOCK',
    thumbnail: {
      url: toneBand,
      label: 'Pursuit Lumaflex&trade; Tone Band',
    },
    sku: '24-UG02',
    url_rewrites: [
      {
        url: 'pursuit-lumaflex-trade-tone-band.html',
      },
    ],
    price_range: {
      minimum_price: {
        final_price: {
          value: 16,
        },
      },
    },
  },
  {
    id: 21,
    __typename: 'SimpleProduct',
    name: 'Sprite Foam Yoga Brick',
    stock_status: 'IN_STOCK',
    thumbnail: {
      url: yogaBrick,
      label: 'Sprite Foam Yoga Brick',
    },
    sku: '24-WG084',
    url_rewrites: [
      {
        url: 'sprite-foam-yoga-brick.html',
      },
    ],
    price_range: {
      minimum_price: {
        final_price: {
          value: 5,
        },
      },
    },
  },
  {
    id: 22,
    __typename: 'SimpleProduct',
    name: 'Sprite Foam Roller',
    stock_status: 'IN_STOCK',
    thumbnail: {
      url: foamRoll,
      label: 'Sprite Foam Roller',
    },
    sku: '24-WG088',
    url_rewrites: [
      {
        url: 'sprite-foam-roller.html',
      },
    ],
    price_range: {
      minimum_price: {
        final_price: {
          value: 19,
        },
      },
    },
  },
  {
    id: 45,
    __typename: 'GroupedProduct',
    name: 'Set of Sprite Yoga Straps',
    stock_status: 'IN_STOCK',
    thumbnail: {
      url: yogaStrap,
      label: 'Set of Sprite Yoga Straps',
    },
    sku: '24-WG085_Group',
    url_rewrites: [
      {
        url: 'set-of-sprite-yoga-straps.html',
      },
    ],
    price_range: {
      minimum_price: {
        final_price: {
          value: 14,
        },
      },
    },
  },
];
