<template>
  <div class="agreements-container">
    <Agreement
      v-for="agreement in agreements"
      :key="agreement.agreement_id"
      :agreement="agreement"
    />
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';

// Components
import Agreement from '@/components/Core/ContentComponents/Agreements/Agreement/Agreement.vue';

export default {
  name: 'Agreements',
  components: {
    Agreement,
  },
  computed: {
    ...mapState(useAgreementStore, ['agreements']),
  },
  created() {
    this.getAgreements();
  },
  methods: {
    ...mapActions(useAgreementStore, ['getAgreements']),
  },
};
</script>
