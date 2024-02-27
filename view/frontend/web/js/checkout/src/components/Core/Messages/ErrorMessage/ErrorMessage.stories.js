import ErrorMessage from './ErrorMessage.vue';

export default {
  title: 'Global/Components/Messages/ErrorMessage',
  component: ErrorMessage,
  backgroundColor: { control: 'color' },
  color: { control: 'color' },
  borderColor: { control: 'color' },
};

const Template = (args) => ({
  components: { ErrorMessage },
  setup() {
    return { args };
  },
  template: '<ErrorMessage v-bind="args"/>',
});

export const ErrorMessageComponent = Template.bind({});

ErrorMessageComponent.args = {
  message: 'Error Message',
};
