import ProgressBarStoryBook from './StoryBookProgressBar/StoryBookProgressBar.vue';

export default {
  title: 'Checkout Structure Components/App/Steps/ProgressBar',
  component: ProgressBarStoryBook,
};

const Template = (args) => ({
  components: { ProgressBarStoryBook },
  setup() {
    return { args };
  },
  template: '<ProgressBarStoryBook v-bind="args"/>',
});

export const ProgressBarComponent = Template.bind({});

ProgressBarComponent.args = {
  firstStepTitle: 'Step 1',
  secondStepTitle: 'Step 2',
  thirdStepTitle: 'Step 3',
};
