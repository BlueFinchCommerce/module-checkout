import Percent from './Percent.vue';

export default {
  title: 'Global/Components/Icons/Percent',
  component: Percent,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Percent },
  setup() {
    return { args };
  },
  template: '<Percent v-bind="args"/>',
});

export const PercentIcon = Template.bind({});

PercentIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Percent Icon',
};
