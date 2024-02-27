import Close from './Close.vue';

export default {
  title: 'Global/Components/Icons/Close',
  component: Close,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Close },
  setup() {
    return { args };
  },
  template: '<Close v-bind="args"/>',
});

export const CloseIcon = Template.bind({});

CloseIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Close icon',
};
