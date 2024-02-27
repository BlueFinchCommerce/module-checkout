import Price from './Price.vue';

export default {
  title: 'Global/Components/Price',
  component: Price,
  argTypes: {
    color: { control: 'color' },
    fontSize: {
      control: { type: 'select' },
      options: ['x-small', '12px', '14px', '16px',
        '18px', ' 20px', '24px', '28px', '32px', 'xx-large'],
    },
  },
};

const Template = (args) => ({
  components: { Price },
  setup() {
    return { args };
  },
  template: '<Price v-bind="args"/>',
});

export const PriceComponent = Template.bind({});

PriceComponent.args = {
  value: '43',
  fontWeight: '400',
  fontStyle: 'normal',
};
