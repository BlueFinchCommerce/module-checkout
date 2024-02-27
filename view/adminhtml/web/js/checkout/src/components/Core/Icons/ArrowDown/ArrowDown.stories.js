import ArrowDown from './ArrowDown.vue';

export default {
  title: 'Global/Components/Icons/ArrowDown',
  component: ArrowDown,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ArrowDown },
  setup() {
    return { args };
  },
  template: '<ArrowDown v-bind="args"/>',
});

export const ArrowDownIcon = Template.bind({});

ArrowDownIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow down icon',
};
