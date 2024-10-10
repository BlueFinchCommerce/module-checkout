import ArrowLeft from './ArrowLeft.vue';

export default {
  title: 'Global/Components/Icons/ArrowLeft',
  component: ArrowLeft,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ArrowLeft },
  setup() {
    return { args };
  },
  template: '<ArrowLeft v-bind="args"/>',
});

export const ArrowLeftIcon = Template.bind({});

ArrowLeftIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow left icon',
};
