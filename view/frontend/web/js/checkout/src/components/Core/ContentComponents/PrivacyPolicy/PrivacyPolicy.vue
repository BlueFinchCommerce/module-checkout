<template>
  <template v-if="privacyPolicy.content">
    <div class="privacy-policy-container">
      <span class="privacy-policy-content">{{ $t('privacyPolicy.content') }}</span>
      <button
        type="button"
        class="privacy-policy-content_button button--blank"
        @click="showModal"
        @keydown="showModal"
      >{{ $t('privacyPolicy.link' ) }}
      </button>
    </div>
    <modal
      :visible="isModalVisible"
      classes="privacy-modal"
      @close="closeModal"
    >
      <template #header>
        <div class="closer-container">
          <button
            type="button"
            class="button button--blank privacy-close"
            aria-label="Close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
      </template>
      <template #body>
        <div v-html="privacyPolicy.content" />
      </template>

      <template #footer>
        <ButtonComponent
          class="modal-footer-btn-close"
          secondary
          label="Back"
          aria-label="Back"
          @click="closeModal"
        />
      </template>
    </modal>
  </template>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// Components
import Modal from '@/components/Core/ActionComponents/Modal/Modal.vue';
import ButtonComponent from '@/components/Core/ActionComponents/Button/Button.vue';

export default {
  name: 'PrivacyPolicy',
  components: {
    Modal,
    ButtonComponent,
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  computed: {
    ...mapState(useConfigStore, ['privacyPolicy']),
  },
  async created() {
    await this.getPrivacyPolicyBlock();
  },
  methods: {
    ...mapActions(useConfigStore, ['getPrivacyPolicyBlock']),
    showModal() {
      document.body.classList.add('no-scrollable');
      this.isModalVisible = true;
    },
    closeModal() {
      document.body.classList.remove('no-scrollable');
      this.isModalVisible = false;
    },
  },
};

</script>

<style lang="scss" scoped>
@import "./styles";
</style>
