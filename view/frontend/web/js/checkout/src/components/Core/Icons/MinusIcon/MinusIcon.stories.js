import MinusIcon from './MinusIcon.vue';

export default {
  title: 'Global/Components/Icons/MinusIcon',
  component: MinusIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { MinusIcon },
  setup() {
    return { args };
  },
  template: '<MinusIcon v-bind="args"/>',
});

export const MinusIconIcon = Template.bind({});

MinusIconIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow down icon',
};
