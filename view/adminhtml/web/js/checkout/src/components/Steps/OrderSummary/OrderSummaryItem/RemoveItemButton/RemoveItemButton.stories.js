import RemoveItemButton from './RemoveItemButton.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/OrderSummary/RemoveItemButton',
  component: RemoveItemButton,
};

const Template = (args) => ({
  components: { RemoveItemButton },
  setup() {
    return { args };
  },
  template: '<RemoveItemButton v-bind="args"/>',
});

export const RemoveItemButtonComponent = Template.bind({});
