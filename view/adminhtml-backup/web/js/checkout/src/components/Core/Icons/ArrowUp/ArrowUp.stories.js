import ArrowUp from './ArrowUp.vue';

export default {
  title: 'Global/Components/Icons/ArrowUp',
  component: ArrowUp,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ArrowUp },
  setup() {
    return { args };
  },
  template: '<ArrowUp v-bind="args"/>',
});

export const ArrowUpIcon = Template.bind({});

ArrowUpIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow up icon',
};
