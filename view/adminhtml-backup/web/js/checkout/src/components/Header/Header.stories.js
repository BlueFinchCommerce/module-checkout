import Header from './Header.vue';

export default {
  title: 'Checkout Structure Components/App/Header',
  component: Header,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Header },
  setup() {
    return { args };
  },
  template: '<Header v-bind="args"/>',
});

export const HeaderComponent = Template.bind({});
