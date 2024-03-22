import App from './App.vue';

export default {
  title: 'Checkout Structure Components/App',
  component: App,
};

const Template = (args) => ({
  components: { App },
  setup() {
    return { args };
  },
  template: '<App v-bind="args"/>',
});

export const CheckoutApp = Template.bind({});
