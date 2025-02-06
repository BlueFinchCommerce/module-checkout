<template>
  <div class="divider">
    <div class="divider-line" />
    <TextField
      v-if="isExpressPaymentsVisible"
      :text="dividerText"
    />
    <TextField
      v-else
      :text="$t('payNoExpressWithBlockTitle')"
    />
    <div class="divider-line" />
  </div>
</template>
<script>
import { mapState } from 'pinia';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'DividerComponent',
  components: {
    TextField,
  },
  data() {
    return {
      dividerText: '',
      dividerTextId: 'bluefinch-checkout-divider-text',
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['availableMethods', 'isExpressPaymentsVisible']),
  },
  mounted() {
    this.dividerText = window.bluefinchCheckout?.[this.dividerTextId] || this.$t('dividerText');

    document.addEventListener(this.dividerTextId, this.setDividerText);
  },
  unmounted() {
    document.removeEventListener(this.dividerTextId, this.setDividerText);
  },
  methods: {
    setDividerText(event) {
      this.dividerText = event?.detail?.value || this.$t('dividerText');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
