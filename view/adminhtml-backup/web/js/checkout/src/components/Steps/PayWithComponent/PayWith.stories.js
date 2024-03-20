import PayWith from './PayWith.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/PayWith',
  component: PayWith,
  argTypes: {
    background: { control: 'color' },
    width: { input: 'width' },
    height: { input: 'height' },
  },
};

const Template = (args) => ({
  components: { PayWith },
  setup() {
    return { args };
  },
  template: '<PayWith v-bind="args"/>',
});

export const PayWithComponent = Template.bind({});

PayWithComponent.args = {
  width: '',
  height: '',
  background: '',
};
