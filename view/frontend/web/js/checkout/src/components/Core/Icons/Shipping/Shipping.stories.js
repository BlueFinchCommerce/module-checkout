import Shipping from './Shipping.vue';

export default {
  title: 'Global/Components/Icons/Shipping',
  component: Shipping,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Shipping },
  setup() {
    return { args };
  },
  template: '<Shipping v-bind="args"/>',
});

export const ShippingIcon = Template.bind({});

ShippingIcon.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Shipping icon',
};
