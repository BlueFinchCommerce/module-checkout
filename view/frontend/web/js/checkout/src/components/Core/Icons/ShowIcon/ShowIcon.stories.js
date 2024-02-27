import ShowIcon from './ShowIcon.vue';

export default {
  title: 'Global/Components/Icons/ShowIcon',
  component: ShowIcon,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { ShowIcon },
  setup() {
    return { args };
  },
  template: '<ShowIcon v-bind="args"/>',
});

export const ShowIconIcon = Template.bind({});

ShowIconIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow down icon',
};
