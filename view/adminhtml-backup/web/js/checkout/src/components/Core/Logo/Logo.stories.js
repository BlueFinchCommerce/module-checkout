import Logo from './Logo.vue';

export default {
  title: 'Global/Components/Icons/Logo',
  component: Logo,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Logo },
  setup() {
    return { args };
  },
  template: '<Logo v-bind="args"/>',
});

export const LogoIcon = Template.bind({});

LogoIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Logo icon',
};
