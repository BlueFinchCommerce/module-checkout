<template>
  <div class="agreement-container">
    <div v-if="agreement.mode === 'MANUAL'">
      <CheckboxComponent
        class="agreement-checkbox"
        :id="`${agreement.agreement_id}-${id}`"
        :checked="agreement.approved"
        :change-handler="changeAgreement"
      >
        {{ $t('agreements.label') }}
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
          <TextField class="modal-header-title"
                     :text="$t('agreements.title')"
          />
          <button
            type="button"
            class="button button--blank agreement-close"
            aria-label="Close"
            @click="closeModal"
          >
            <CloseIcon />
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
          class="modal-footer-btn-close button--secondary"
          :label="$t('orderSummary.backBtn')"
          :aria-label="$t('orderSummary.backBtn')"
          @click="closeModal"
        />
        <ButtonComponent
          class="modal-footer-btn-close button--primary"
          :label="$t('agreements.acceptBtn')"
          :aria-label="$t('agreements.acceptBtn')"
          @click="changeAgreementFromModal"
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
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Stores
import { mapActions } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';

// Icons
import CloseIcon from '@/components/Core/Icons/Close/Close.vue';

export default {
  name: 'Agreement',
  components: {
    TextField,
    ButtonComponent,
    CheckboxComponent,
    ErrorMessage,
    Modal,
    CloseIcon,
  },
  props: {
    agreement: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  mounted() {
    document.addEventListener('focusin', this.handleFocusIn);
  },
  methods: {
    ...mapActions(useAgreementStore, ['updateAgreementData']),
    changeAgreement(event) {
      const { currentTarget } = event;
      if (typeof currentTarget.checked !== 'undefined') {
        this.updateAgreementData(this.agreement, currentTarget.checked);
      }
    },
    handleFocusIn(event) {
      const modal = document.querySelector('.agreement-container .modal');
      if (modal && !modal.contains(event.target)) {
        // If the focused element is outside the modal, close the modal
        this.closeModal();
      }
    },
    trapFocus(event) {
      const modal = document.querySelector('.agreement-container .modal');
      const focusableButtons = modal.querySelectorAll('button:not([disabled])');
      const firstButton = focusableButtons[0];

      if (this.isModalVisible) {
        event.preventDefault();
        firstButton.focus();
      }
    },
    changeAgreementFromModal() {
      // Find the checkbox within .agreement-checkbox
      const agreementCheckbox = document.querySelector('.agreement-checkbox input[type="checkbox"]');

      // Check if the checkbox exists and is checked
      if (agreementCheckbox && !agreementCheckbox.checked) {
        this.updateAgreementData(this.agreement, true);
      }

      this.closeModal();
    },
    showModal(event) {
      event.preventDefault();
      document.body.classList.add('no-scrollable');
      this.isModalVisible = true;
      this.trapFocus(event);
    },
    closeModal() {
      document.body.classList.remove('no-scrollable');
      this.isModalVisible = false;
    },
  },
};

</script>

<style lang="scss">
@import "./styles";
</style>
