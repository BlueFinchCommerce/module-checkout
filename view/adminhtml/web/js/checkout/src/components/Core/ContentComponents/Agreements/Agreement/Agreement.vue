<template>
  <div class="agreement-container">
    <div v-if="agreement.mode === 'MANUAL'">
      <CheckboxComponent
        :id="agreement.agreement_id"
        :checked="agreement.approved"
        :change-handler="changeAgreement"
      >
        {{ $t('agreements.label') }}&nbsp;
        <a
          href="#"
          class="agreement-open-modal"
          @click="showModal"
          @keydown="showModal"
          v-html="agreement.checkbox_text"
        />
      </CheckboxComponent>
    </div>
    <span
      v-else
      class="agreement-label"
    >
      <span>{{ $t('agreements.label') }}</span>&nbsp;
      <a
        href="#"
        class="agreement-open-modal"
        @click="showModal"
        @keydown="showModal"
        v-html="agreement.checkbox_text"
      />
      <ErrorMessage
        v-if="typeof agreement.valid !== 'undefined' && !agreement.valid"
        :message="$t('agreements.errorMessage')"
      />
    </span>
    <modal
      :visible="isModalVisible"
      @close="closeModal"
    >
      <template #header>
        <div class="closer-container">
          <button
            type="button"
            class="button button--blank agreement-close"
            aria-label="Close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
      </template>
      <template #body>
        <div>
          <p v-html="agreement.content" />
        </div>
      </template>

      <template #footer>
        <ButtonComponent
          class="modal-footer-btn-close"
          label="Close"
          aria-label="close"
          @click="closeModal"
        />
      </template>
    </modal>
  </div>
</template>

<script>

// Components
import ButtonComponent from '@/components/Core/ActionComponents/Button/Button.vue';
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Modal from '@/components/Core/ActionComponents/Modal/Modal.vue';

// Stores
import { mapActions } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';

export default {
  name: 'Agreement',
  components: {
    ButtonComponent,
    CheckboxComponent,
    ErrorMessage,
    Modal,
  },
  props: {
    agreement: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    ...mapActions(useAgreementStore, ['updateAgreementData']),
    changeAgreement(event) {
      const { currentTarget } = event;
      if (typeof currentTarget.checked !== 'undefined') {
        this.updateAgreementData(this.agreement, currentTarget.checked);
      }
    },
    showModal(event) {
      event.preventDefault();
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
