import SuccessMessage from './SuccessMessage.vue';

export default {
  title: 'Global/Components/Messages/SuccessMessage',
  component: SuccessMessage,
  backgroundColor: { control: 'color' },
  color: { control: 'color' },
  borderColor: { control: 'color' },
};

const Template = (args) => ({
  components: { SuccessMessage },
  setup() {
    return { args };
  },
  template: '<SuccessMessage v-bind="args"/>',
});

export const SuccessMessageComponent = Template.bind({});

SuccessMessageComponent.args = {
  message: 'Success Message',
};
