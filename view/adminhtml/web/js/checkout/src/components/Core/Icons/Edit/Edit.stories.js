import Edit from './Edit.vue';

export default {
  title: 'Global/Components/Icons/Edit',
  component: Edit,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Edit },
  setup() {
    return { args };
  },
  template: '<Edit v-bind="args"/>',
});

export const EditIcon = Template.bind({});

EditIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow up icon',
};
