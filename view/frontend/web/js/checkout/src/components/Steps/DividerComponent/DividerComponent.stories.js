import DividerComponent from './DividerComponent.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/DividerComponent',
  component: DividerComponent,
};

const Template = (args) => ({
  components: { DividerComponent },
  setup() {
    return { args };
  },
  template: '<DividerComponent v-bind="args"/>',
});

export const Divider = Template.bind({});
