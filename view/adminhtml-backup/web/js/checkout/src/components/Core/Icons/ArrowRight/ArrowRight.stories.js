import ArrowRight from './ArrowRight.vue';

export default {
  title: 'Global/Components/Icons/ArrowRight',
  component: ArrowRight,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ArrowRight },
  setup() {
    return { args };
  },
  template: '<ArrowRight v-bind="args"/>',
});

export const ArrowRightIcon = Template.bind({});

ArrowRightIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow right icon',
};
