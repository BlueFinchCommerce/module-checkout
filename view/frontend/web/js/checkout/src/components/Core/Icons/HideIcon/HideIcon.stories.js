import HideIcon from './HideIcon.vue';

export default {
  title: 'Global/Components/Icons/HideIcon',
  component: HideIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { HideIcon },
  setup() {
    return { args };
  },
  template: '<HideIcon v-bind="args"/>',
});

export const HideIconIcon = Template.bind({});

HideIconIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow down icon',
};
