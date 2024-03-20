import SuccessIcon from './SuccessIcon.vue';

export default {
  title: 'Global/Components/Icons/ErrorIcon',
  component: SuccessIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { SuccessIcon },
  setup() {
    return { args };
  },
  template: '<SuccessIcon v-bind="args"/>',
});

export const SuccessIconComponent = Template.bind({});

SuccessIconComponent.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Success icon',
};
