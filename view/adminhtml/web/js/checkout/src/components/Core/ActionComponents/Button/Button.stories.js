import MyButton from './Button.vue';

export default {
  title: 'Global/Components/Button',
  component: MyButton,
  argTypes: {
    backgroundColor: { control: 'color' },
    role: 'Button',
  },
};

const Template = (args) => ({
  components: { MyButton },
  setup() {
    return { args };
  },
  template: '<MyButton v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};
