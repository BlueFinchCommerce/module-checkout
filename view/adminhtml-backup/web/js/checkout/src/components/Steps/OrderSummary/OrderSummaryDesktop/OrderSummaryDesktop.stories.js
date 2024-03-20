import OrderSummaryDesktop from './OrderSummaryDesktop.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/OrderSummaryDesktop',
  component: OrderSummaryDesktop,
};

const Template = (args) => ({
  components: { OrderSummaryDesktop },
  setup() {
    return { args };
  },
  template: '<OrderSummaryDesktop v-bind="args"/>',
});

export const OrderSummaryDesktopComponent = Template.bind({});
