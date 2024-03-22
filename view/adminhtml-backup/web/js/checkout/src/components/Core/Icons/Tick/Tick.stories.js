import Tick from './Tick.vue';

export default {
  title: 'Global/Components/Icons/Tick',
  component: Tick,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Tick },
  setup() {
    return { args };
  },
  template: '<Tick v-bind="args"/>',
});

export const TickIcon = Template.bind({});

TickIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Tick icon',
};
