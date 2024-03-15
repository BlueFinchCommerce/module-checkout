import Loader from './Loader.vue';

export default {
  title: 'Global/Components/Loader',
  component: Loader,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
  },
};

const Template = (args) => ({
  components: { Loader },
  setup() {
    return { args };
  },
  template: '<Loader v-bind="args"/>',
});

export const LoaderIcon = Template.bind({});

LoaderIcon.args = {
  width: '',
  height: '',
};
