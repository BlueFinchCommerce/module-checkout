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
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

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
    this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>

<style lang="scss">
@import "./styles";
</style>
