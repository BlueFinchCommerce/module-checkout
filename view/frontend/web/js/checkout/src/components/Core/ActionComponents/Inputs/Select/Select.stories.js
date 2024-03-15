import Select from './Select.vue';

export default {
  title: 'Global/Components/Inputs/Select',
  component: Select,
};

const Template = (args) => ({
  components: { Select },
  setup() {
    return { args };
  },
  template: '<Select v-bind="args"/>',
});

export const SelectInput = Template.bind({});

SelectInput.args = {
  name: '',
  options: [
    {
      option: {
        name: 'First',
        value: '1',
      },
    },
    {
      option: {
        name: 'Second',
        value: '2',
      },
    },
  ],
  selectedOption: 'Please select your country',
  dataRole: '',
  disabled: false,
};
