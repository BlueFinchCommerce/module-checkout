import OrderSummaryMobile from './OrderSummaryMobile.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/OrderSummaryMobile',
  component: OrderSummaryMobile,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { OrderSummaryMobile },
  setup() {
    return { args };
  },
  template: '<OrderSummaryMobile v-bind="args"/>',
});

export const OrderSummaryMobileComponent = Template.bind({});
