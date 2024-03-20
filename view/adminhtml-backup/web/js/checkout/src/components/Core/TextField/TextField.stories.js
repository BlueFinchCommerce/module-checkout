import TextField from './TextField.vue';

export default {
  title: 'Global/Components/TextField',
  component: TextField,
  argTypes: {
    color: { control: 'color' },
    fontSize: {
      control: { type: 'select' },
      options: ['x-small', '12px', '14px', '16px',
        '18px', ' 20px', '24px', '28px', '32px', 'xx-large'],
    },
  },
};

const Template = (args) => ({
  components: { TextField },
  setup() {
    return { args };
  },
  template: '<TextField v-bind="args"/>',
});

export const Paragraph = Template.bind({});

Paragraph.args = {
  text: 'Paragraph component',
  fontWeight: '400',
  fontStyle: 'normal',
};
