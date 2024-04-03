import StoryBookDropDownTrigger from './StoryBookDropDownTrigger.vue';

export default {
  title: 'Global/Components/Inputs/DropDown',
  component: StoryBookDropDownTrigger,
};

const Template = (args) => ({
  components: { StoryBookDropDownTrigger },
  setup() {
    return { args };
  },
  template: '<StoryBookDropDownTrigger v-bind="args"/>',
});

export const DropDownComponent = Template.bind({});
DropDownComponent.args = {
  dropDownContent: '',
};
