import Search from './Search.vue';

export default {
  title: 'Global/Components/Icons/Search',
  component: Search,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Search },
  setup() {
    return { args };
  },
  template: '<Search v-bind="args"/>',
});

export const SearchIcon = Template.bind({});

SearchIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Search icon',
};
