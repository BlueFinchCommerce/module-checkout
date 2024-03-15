<template>
  <template v-if="privacyPolicy.content && withdrawTermsServices.content && generalTermsServices.content">
    <div class="terms-services-container">
      <span class="privacy-policy-content">{{ $t('termsServices.content') }}</span>
      <button
        type="button"
        class="privacy-policy-content_button button--blank general"
        @click="showGeneralModal"
        @keydown="showGeneralModal"
      >{{ $t('termsServices.generalLink' ) }}
      </button>
      <button
        type="button"
        class="privacy-policy-content_button button--blank privacy"
        @click="showPrivacyModal"
        @keydown="showPrivacyModal"
      >{{ $t('termsServices.privacyLink' ) }}
      </button>
      <button
        type="button"
        class="privacy-policy-content_button button--blank withdraw"
        @click="showWithdrawModal"
        @keydown="showWithdrawModal"
      >{{ $t('termsServices.withdrawLink' ) }}
      </button>
    </div>
    <modal
      :visible="isPrivacyModalVisible"
      @close="closePrivacyModal"
    >
      <template #header>
        <div class="closer-container">
          <button
            type="button"
            class="button button--blank privacy-close"
            aria-label="Close"
            @click="closePrivacyModal"
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
          label="Close"
          aria-label="close"
          @click="closePrivacyModal"
        />
      </template>
    </modal>
    <modal
      :visible="isWithdrawModalVisible"
      @close="closeWithdrawModal"
    >
      <template #header>
        <div class="closer-container">
          <button
            type="button"
            class="button button--blank privacy-close"
            aria-label="Close"
            @click="closeWithdrawModal"
          >
            ✕
          </button>
        </div>
      </template>
      <template #body>
        <div v-html="withdrawTermsServices.content" />
      </template>

      <template #footer>
        <ButtonComponent
          class="modal-footer-btn-close"
          label="Close"
          aria-label="close"
          @click="closeWithdrawModal"
        />
      </template>
    </modal>
    <modal
      :visible="isGeneralModalVisible"
      @close="closeGeneralModal"
    >
      <template #header>
        <div class="closer-container">
          <button
            type="button"
            class="button button--blank privacy-close"
            aria-label="Close"
            @click="closeGeneralModal"
          >
            ✕
          </button>
        </div>
      </template>
      <template #body>
        <div v-html="generalTermsServices.content" />
      </template>

      <template #footer>
        <ButtonComponent
          class="modal-footer-btn-close"
          label="Close"
          aria-label="close"
          @click="closeGeneralModal"
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

export default {
  name: 'TermsService',
  components: {
    Modal,
  },
  data() {
    return {
      isPrivacyModalVisible: false,
      isWithdrawModalVisible: false,
      isGeneralModalVisible: false,
    };
  },
  computed: {
    ...mapState(useConfigStore, ['privacyPolicy', 'generalTermsServices', 'withdrawTermsServices']),
  },
  async created() {
    await this.getPrivacyPolicyBlock();
    await this.getGeneralTermsServicesBlock();
    await this.getWithdrawTermsServicesBlock();
  },
  methods: {
    ...mapActions(useConfigStore, ['getPrivacyPolicyBlock', 'getGeneralTermsServicesBlock',
      'getWithdrawTermsServicesBlock']),
    showPrivacyModal() {
      document.body.classList.add('no-scrollable');
      this.isPrivacyModalVisible = true;
    },
    showWithdrawModal() {
      document.body.classList.add('no-scrollable');
      this.isWithdrawModalVisible = true;
    },
    showGeneralModal() {
      document.body.classList.add('no-scrollable');
      this.isGeneralModalVisible = true;
    },
    closePrivacyModal() {
      document.body.classList.remove('no-scrollable');
      this.isPrivacyModalVisible = false;
    },
    closeWithdrawModal() {
      document.body.classList.remove('no-scrollable');
      this.isWithdrawModalVisible = false;
    },
    closeGeneralModal() {
      document.body.classList.remove('no-scrollable');
      this.isGeneralModalVisible = false;
    },
  },
};

</script>

<style lang="scss" scoped>
@import "./styles";
</style>
