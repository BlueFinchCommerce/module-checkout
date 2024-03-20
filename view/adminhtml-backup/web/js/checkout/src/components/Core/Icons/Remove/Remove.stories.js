import Remove from './Remove.vue';

export default {
  title: 'Global/Components/Icons/Remove',
  component: Remove,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Remove },
  setup() {
    return { args };
  },
  template: '<Remove v-bind="args"/>',
});

export const RemoveIcon = Template.bind({});

RemoveIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Remove icon',
};
