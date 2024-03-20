import RadioButton from './RadioButton.vue';

export default {
  title: 'Global/Components/Inputs/RadioButton',
  component: RadioButton,
  color: { control: 'color' },
  fontSize: {
    control: { type: 'select' },
    options: ['x-small', '12px', '14px', '16px', '18px',
      ' 20px', '24px', '28px', '32px', 'xx-large'],
  },
};

const Template = (args) => ({
  components: { RadioButton },
  setup() {
    return { args };
  },
  template: '<RadioButton v-bind="args"/>',
});

export const RadioButtonInput = Template.bind({});

RadioButtonInput.args = {
  text: 'Radio Button Component',
  subtext: 'Subtext',
  disabled: false,
  checked: false,
  subtextShow: false,
  fontWeight: '400',
  fontStyle: 'normal',
  ariaChecked: 'false',
  role: 'radio',
};
