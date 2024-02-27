export default () => (
  [
    {
      code: 'subtotal',
      title: 'Subtotal',
      value: 127,
    },
    {
      code: 'giftwrapping',
      title: 'Gift Wrapping',
      value: null,
      extension_attributes: {
        gw_item_ids: [],
        gw_price: '0.0000',
        gw_base_price: '0.0000',
        gw_items_price: '0.0000',
        gw_items_base_price: '0.0000',
        gw_card_price: '0.0000',
        gw_card_base_price: '0.0000',
      },
    },
    {
      code: 'discount',
      title: 'Discount (discount)',
      value: -19.4,
    },
    {
      code: 'shipping',
      title: 'Shipping & Handling',
      value: 0,
    },
    {
      code: 'tax',
      title: 'Tax',
      value: 0,
      extension_attributes: {
        tax_grandtotal_details: [],
      },
    },
    {
      code: 'grand_total',
      title: 'Grand Total',
      value: 97.6,
      area: 'footer',
    },
    {
      code: 'giftcardaccount',
      title: 'Gift Cards',
      value: -10,
      extension_attributes: {
        gift_cards: '[{"i":1,"c":"00Z4OBD0ZJ4A","a":10,"ba":10}]',
      },
    },
    {
      code: 'customerbalance',
      title: 'Store Credit',
      value: 0,
    },
    {
      code: 'reward',
      title: '0 Reward points',
      value: 0,
    },
  ]
);
