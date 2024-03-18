<template>
  <div class="agreements-container">
    <Agreement
      v-for="agreement in data.agreements"
      :key="agreement.agreementId"
      :agreement="agreement"
    />
  </div>
</template>

<script>

// Stores
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';

// Components
import Agreement from '@/components/Core/Agreements/Agreement/Agreement.vue';

export default {
  name: 'Agreements',
  components: {
    Agreement,
  },
  computed: {
    ...mapState(useCartStore, ['data']),
  },
};
</script>
