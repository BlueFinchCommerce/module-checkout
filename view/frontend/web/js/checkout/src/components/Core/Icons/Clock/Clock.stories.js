import Clock from './Clock.vue';

export default {
  title: 'Global/Components/Icons/Clock',
  component: Clock,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Clock },
  setup() {
    return { args };
  },
  template: '<Clock v-bind="args"/>',
});

export const ClockIcon = Template.bind({});

ClockIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Clock Icon',
};
