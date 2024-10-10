import HeaderStoryBook from './HeaderStoryBook/HeaderStoryBook.vue';

export default {
  title: 'Checkout Structure Components/App/Header',
  component: HeaderStoryBook,
  argTypes: {
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { HeaderStoryBook },
  setup() {
    return { args };
  },
  template: '<HeaderStoryBook v-bind="args"/>',
});

export const HeaderComponent = Template.bind({});

HeaderComponent.args = {
  backgroundColor: '#000',
  color: '#fff',
  headerText: 'Secure Checkout',
};
