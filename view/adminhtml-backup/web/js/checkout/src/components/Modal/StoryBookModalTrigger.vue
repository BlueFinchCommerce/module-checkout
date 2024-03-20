<template>
  <ButtonComponent
      :label="modalTriggerText"
      primary
      role="button"
      @click="showModal"
      ariaLabel="show modal"/>
  <modal
      v-show="isModalVisible"
      @close="closeModal"
  >
    <template v-slot:header>
      {{ modalHeader }}
    </template>

    <template v-slot:body>
      {{ modalContent }}
    </template>

    <template v-slot:footer>
      {{ modalFooter }}
    </template>
  </modal>
</template>
<script>
import Modal from './Modal.vue';
import ButtonComponent from '../Core/Button/Button.vue';

export default {
  name: 'StoryBookModalTrigger',
  components: {
    Modal,
    ButtonComponent,
  },
  props: {
    modalTriggerText: {
      type: String,
      require: true,
      default: 'Open Modal',
    },
    modalHeader: {
      type: String,
    },
    modalContent: {
      type: String,
    },
    modalFooter: {
      type: String,
    },
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>
