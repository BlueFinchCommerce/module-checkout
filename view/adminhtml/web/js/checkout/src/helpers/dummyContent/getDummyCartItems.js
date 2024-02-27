import duffle from '@/icons/products/duffle.jpg';
import giftCard from '@/icons/products/gift-card.jpg';
import jackshirt from '@/icons/products/jackshirt.jpg';
import shoulder from '@/icons/products/shoulder.jpg';

export default () => {
  const items = [
    {
      product_type: 'configurable',
      options: [
        {
          label: 'Size',
          value: 'M',
          option_id: 186,
          option_value: '177',
        },
        {
          label: 'Color',
          value: 'Blue',
          option_id: 93,
          option_value: '59',
        },
      ],
      qty: 1,
      item_id: '174',
      configure_url: 'https://braintree-checkout.test/checkout/cart/configure/id/174/product_id/430/',
      is_visible_in_site_visibility: true,
      product_id: '430',
      product_name: 'Proteus Fitness Jackshirt',
      product_sku: 'MJ12-M-Blue',
      product_url: 'https://braintree-checkout.test/proteus-fitness-jackshirt.html',
      product_has_url: true,
      product_price: '\n\n    <span class="price-excluding-tax" data-label="Excl.&#x20;Tax">\n            <span class="minicart-price">\n            <span class="price">$45.00</span>        </span>\n\n        </span>\n',
      product_price_value: 45,
      product_image: {
        src: jackshirt,
        alt: 'Proteus Fitness Jackshirt',
        width: 150,
        height: 150,
      },
      canApplyMsrp: false,
      message: '',
    },
    {
      product_type: 'giftcard',
      options: [
        {
          label: 'Gift Card Sender',
          value: 'Test User &lt;sender@example.com&gt;',
          option_type: 'html',
        },
        {
          label: 'Gift Card Recipient',
          value: 'Recipient Name &lt;recipient@example.com&gt;',
          option_type: 'html',
        },
        {
          label: 'Gift Card Message',
          value: '                        ',
          option_type: 'html',
        },
      ],
      qty: 1,
      item_id: '173',
      configure_url: 'https://braintree-checkout.test/checkout/cart/configure/id/173/product_id/2042/',
      is_visible_in_site_visibility: true,
      product_id: '2042',
      product_name: 'Luma Virtual Gift Card',
      product_sku: '243-MB09',
      product_url: 'https://braintree-checkout.test/luma-virtual-gift-card.html',
      product_has_url: true,
      product_price: '\n\n    <span class="price-excluding-tax" data-label="Excl.&#x20;Tax">\n            <span class="minicart-price">\n            <span class="price">$30.00</span>        </span>\n\n        </span>\n',
      product_price_value: 30,
      product_image: {
        src: giftCard,
        alt: 'Luma Virtual Gift Card',
        width: 150,
        height: 150,
      },
      canApplyMsrp: false,
      message: '',
      is_virtual: 1,
    },
    {
      product_type: 'simple',
      options: [],
      qty: 1,
      item_id: '172',
      configure_url: 'https://braintree-checkout.test/checkout/cart/configure/id/172/product_id/2/',
      is_visible_in_site_visibility: true,
      product_id: '2',
      product_name: 'Strive Shoulder Pack',
      product_sku: '24-MB04',
      product_url: 'https://braintree-checkout.test/strive-shoulder-pack.html',
      product_has_url: true,
      product_price: '\n\n    <span class="price-excluding-tax" data-label="Excl.&#x20;Tax">\n            <span class="minicart-price">\n            <span class="price">$32.00</span>        </span>\n\n        </span>\n',
      product_price_value: 32,
      product_image: {
        src: shoulder,
        alt: 'Strive Shoulder Pack',
        width: 150,
        height: 150,
      },
      canApplyMsrp: false,
      message: '',
    },
    {
      product_type: 'simple',
      options: [],
      qty: 1,
      item_id: '171',
      configure_url: 'https://braintree-checkout.test/checkout/cart/configure/id/171/product_id/1/',
      is_visible_in_site_visibility: true,
      product_id: '1',
      product_name: 'Joust Duffle Bag',
      product_sku: '24-MB01',
      product_url: 'https://braintree-checkout.test/joust-duffle-bag.html',
      product_has_url: true,
      product_price: '\n\n    <span class="price-excluding-tax" data-label="Excl.&#x20;Tax">\n            <span class="minicart-price">\n            <span class="price">$20.00</span>        </span>\n\n        </span>\n',
      product_price_value: 20,
      product_image: {
        src: duffle,
        alt: 'Joust Duffle Bag',
        width: 150,
        height: 150,
      },
      canApplyMsrp: false,
      message: '',
    },
  ];

  return items.reduce((prev, curr) => {
    const newItems = prev;
    newItems[curr.item_id] = {
      image: curr.product_image,
      name: curr.product_name,
      price: curr.product_price_value,
      price_incl_tax: curr.product_price_value,
      ...curr,
    };
    return newItems;
  }, {});
};
