import QtyButton from './QtyButton.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/QtyButton',
  component: QtyButton,
};

const Template = (args) => ({
  components: { QtyButton },
  setup() {
    return { args };
  },
  template: '<QtyButton v-bind="args"/>',
});

export const QtyButtonComponent = Template.bind({});
