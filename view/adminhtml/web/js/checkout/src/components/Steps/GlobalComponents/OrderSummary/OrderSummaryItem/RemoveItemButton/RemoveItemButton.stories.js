import RemoveItemButton from './RemoveItemButton.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/RemoveItemButton',
  component: RemoveItemButton,
};

const Template = (args) => ({
  components: { RemoveItemButton },
  setup() {
    const product = {
      id: '123',
      name: 'Sample Product',
      price: 19.99,
      imageUrl: 'https://example.com/product-image.jpg',
    };

    return { args, product };
  },
  template: '<RemoveItemButton :product="product" v-bind="args"/>',
});

export const RemoveItemButtonComponent = Template.bind({});
