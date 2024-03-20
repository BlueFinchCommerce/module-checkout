import PlusIcon from './PlusIcon.vue';

export default {
  title: 'Global/Components/Icons/PlusIcon',
  component: PlusIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { PlusIcon },
  setup() {
    return { args };
  },
  template: '<PlusIcon v-bind="args"/>',
});

export const PlusIconIcon = Template.bind({});

PlusIconIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow down icon',
};
