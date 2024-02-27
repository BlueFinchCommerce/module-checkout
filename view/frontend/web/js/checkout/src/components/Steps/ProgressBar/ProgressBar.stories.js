import ProgressBar from './ProgressBar.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/ProgressBar',
  component: ProgressBar,
};

const Template = (args) => ({
  components: { ProgressBar },
  setup() {
    return { args };
  },
  template: '<ProgressBar v-bind="args"/>',
});

export const ProgressBarComponent = Template.bind({});
