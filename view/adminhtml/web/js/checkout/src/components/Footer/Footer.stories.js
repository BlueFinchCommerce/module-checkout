import FooterStoryBook from './FooterStoryBook/FooterStoryBook.vue';

export default {
  title: 'Checkout Structure Components/App/Footer',
  component: FooterStoryBook,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { FooterStoryBook },
  setup() {
    return { args };
  },
  template: '<FooterStoryBook v-bind="args"/>',
});

export const FooterComponent = Template.bind({});

FooterComponent.args = {
  copyrightText: '@COPYRIGHT 2024',
};
