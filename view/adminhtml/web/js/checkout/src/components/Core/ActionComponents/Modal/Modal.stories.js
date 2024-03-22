import StoryBookModalTrigger from './StoryBookModalTrigger.vue';

export default {
  title: 'Checkout Structure Components/App/Modal',
  component: StoryBookModalTrigger,
};

const Template = (args) => ({
  components: { StoryBookModalTrigger },
  setup() {
    return { args };
  },
  template: '<StoryBookModalTrigger v-bind="args"/>',
});

export const ModalComponent = Template.bind({});
ModalComponent.args = {
  modalTriggerText: 'Modal Trigger Text',
  modalHeader: 'Modal Header',
  modalContent: 'Modal Content',
  modalFooter: 'Modal Footer',
};
