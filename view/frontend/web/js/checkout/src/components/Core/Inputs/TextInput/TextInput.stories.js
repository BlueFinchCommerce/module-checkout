import TextInput from './TextInput.vue';

export default {
  title: 'Global/Components/Inputs/TextInput',
  component: TextInput,
  borderColor: { control: 'borderColor' },
  error: false,
};

const Template = (args) => ({
  components: { TextInput },
  setup() {
    return { args };
  },
  template: '<TextInput v-bind="args"/>',
});

export const TextInputComponent = Template.bind({});

TextInputComponent.args = {
  placeholder: 'Email',
  label: 'Email Address',
  disabled: false,
  type: 'email',
  required: false,
  ariaLabel: '',
};
