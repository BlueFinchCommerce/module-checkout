import Locate from './Locate.vue';

export default {
  title: 'Global/Components/Icons/Locate',
  component: Locate,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Locate },
  setup() {
    return { args };
  },
  template: '<Locate v-bind="args"/>',
});

export const LocateIcon = Template.bind({});

LocateIcon.args = {
  width: '',
  height: '',
  fill: 'black',
  role: 'img',
  ariaLabel: 'Locate icon',
};
