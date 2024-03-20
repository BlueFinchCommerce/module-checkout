import Calendar from './Calendar.vue';

export default {
  title: 'Global/Components/Icons/Calendar',
  component: Calendar,
  argTypes: {
    width: { input: 'width' },
    height: { input: 'height' },
    fill: { control: 'color' },
    stroke: { control: 'color' },
  },
};

const Template = (args) => ({
  components: { Calendar },
  setup() {
    return { args };
  },
  template: '<Calendar v-bind="args"/>',
});

export const CalendarIcon = Template.bind({});

CalendarIcon.args = {
  width: '',
  height: '',
  fill: '',
  stroke: 'black',
  role: 'img',
  ariaLabel: 'Arrow up icon',
};
