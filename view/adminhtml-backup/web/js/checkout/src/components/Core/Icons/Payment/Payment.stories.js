import Payment from './Payment.vue';

export default {
  title: 'Global/Components/Icons/Payment',
  component: Payment,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Payment },
  setup() {
    return { args };
  },
  template: '<Payment v-bind="args"/>',
});

export const PaymentIcon = Template.bind({});

PaymentIcon.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Payment icon',
};
