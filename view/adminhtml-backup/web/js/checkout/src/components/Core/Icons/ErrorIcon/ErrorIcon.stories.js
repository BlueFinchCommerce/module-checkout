import ErrorIcon from './ErrorIcon.vue';

export default {
  title: 'Global/Components/Icons/ErrorIcon',
  component: ErrorIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ErrorIcon },
  setup() {
    return { args };
  },
  template: '<ErrorIcon v-bind="args"/>',
});

export const ErrorIconComponent = Template.bind({});

ErrorIconComponent.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Locate icon',
};
