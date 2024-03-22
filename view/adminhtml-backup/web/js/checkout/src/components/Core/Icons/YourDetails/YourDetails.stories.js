import YourDetails from './YourDetails.vue';

export default {
  title: 'Global/Components/Icons/YourDetails',
  component: YourDetails,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { YourDetails },
  setup() {
    return { args };
  },
  template: '<YourDetails v-bind="args"/>',
});

export const YourDetailsIcon = Template.bind({});

YourDetailsIcon.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Your details icon',
};
