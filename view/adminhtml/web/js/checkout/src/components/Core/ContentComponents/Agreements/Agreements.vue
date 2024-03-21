<template>
  <div class="agreements-container">
    <Agreement
      v-for="agreement in agreements"
      :id="id"
      :key="agreement.agreement_id"
      :agreement="agreement"
    />
    <ErrorMessage
      v-if="showError"
      :message="$t('agreements.paymentErrorMessage')"
      :attached="false"
    />
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';

// Components
import Agreement from '@/components/Core/ContentComponents/Agreements/Agreement/Agreement.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';

export default {
  name: 'Agreements',
  components: {
    Agreement,
    ErrorMessage,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(useAgreementStore, ['agreements', 'showError']),
  },
  created() {
    this.getAgreements();
  },
  methods: {
    ...mapActions(useAgreementStore, ['getAgreements']),
  },
};
</script>

<style lang="scss">
@import "./styles";
</style>
