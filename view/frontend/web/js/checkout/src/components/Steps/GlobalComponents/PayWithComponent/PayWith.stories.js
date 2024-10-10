import PayWithStoryBook from './StoryBookPayWith/StoryBookPayWith.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/PayWith',
  component: PayWithStoryBook,
};

const Template = (args) => ({
  components: { PayWithStoryBook },
  setup() {
    return { args };
  },
  template: '<PayWithStoryBook v-bind="args"/>',
});

export const PayWithComponent = Template.bind({});

PayWithComponent.args = {
  payWithMessage: 'pay with message',
};
