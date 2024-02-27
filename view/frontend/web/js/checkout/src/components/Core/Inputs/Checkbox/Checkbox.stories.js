import Checkbox from './Checkbox.vue';

export default {
  title: 'Global/Components/Inputs/Checkbox',
  component: Checkbox,
  color: { control: 'color' },
  fontSize: {
    control: { type: 'select' },
    options: ['x-small', '12px', '14px', '16px', '18px', ' 20px',
      '24px', '28px', '32px', 'xx-large'],
  },
};

const Template = (args) => ({
  components: { Checkbox },
  setup() {
    return { args };
  },
  template: '<Checkbox v-bind="args"/>',
});

export const CheckboxInput = Template.bind({});

CheckboxInput.args = {
  text: 'My billing and shipping address are the same',
  disabled: false,
  checked: false,
  fontWeight: '400',
  fontStyle: 'normal',
  ariaChecked: 'false',
  role: 'checkbox',
};
