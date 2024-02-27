import Present from './Present.vue';

export default {
  title: 'Global/Components/Icons/Present',
  component: Present,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Present },
  setup() {
    return { args };
  },
  template: '<Present v-bind="args"/>',
});

export const PresentIcon = Template.bind({});

PresentIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Present Icon',
};
