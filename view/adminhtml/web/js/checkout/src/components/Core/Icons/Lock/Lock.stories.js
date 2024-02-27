import Lock from './Lock.vue';

export default {
  title: 'Global/Components/Icons/Lock',
  component: Lock,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Lock },
  setup() {
    return { args };
  },
  template: '<Lock v-bind="args"/>',
});

export const LockIcon = Template.bind({});

LockIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Lock icon',
};
