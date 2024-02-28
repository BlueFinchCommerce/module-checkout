import StoryBookDropDownTrigger from './StoryBookDropDownTrigger.vue';

export default {
  title: 'Checkout Structure Components/App/DropDown',
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
