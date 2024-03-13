import QtyButton from './QtyButton.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/QtyButton',
  component: QtyButton,
};

const Template = (args) => ({
  components: { QtyButton },
  setup() {
    const product = {
      productId: '123',
      name: 'Sample Product',
      quantity: 1,
    };

    return { args, product };
  },
  template: '<QtyButton :product="product" v-bind="args"/>',
});

export const QtyButtonComponent = Template.bind({});

// Example of how to use the component with specific props
export const DefaultQtyButton = QtyButtonComponent.bind({});
DefaultQtyButton.args = {
  productId: '123',
  name: 'Sample Product',
  quantity: 1,
};
