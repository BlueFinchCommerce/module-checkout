<template>
  <div
    :style="style"
    class="pay-with__container"
  >
    <TextField
      v-if="isExpressPaymentsVisible"
      class="pay-with__message"
      :text="payWithText"
    />
    <TextField
      v-else
      class="pay-with__message"
      :text="$t('payNoExpressWithBlockTitle')"
    />
    <ul class="pay-with__column">
      <li
        v-for="(paymentType, index) in paymentTypes"
        :key="index"
        class="pay-with__content"
      >
        <img
          :src="paymentType.icon"
          :alt="paymentType.name"
        >
      </li>
    </ul>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import usePaymentStore from '@/stores/PaymentStore';

import { computed, reactive } from 'vue';
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'PayWith',
  components: {
    TextField,
  },
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    background: {
      type: String,
    },
    isExpressPaymentsVisible: {
      type: Boolean,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        background: reactiveProps.background,
        width: reactiveProps.width,
        height: reactiveProps.height,
      })),
    };
  },
  data() {
    return {
      payWithText: '',
      payWithTextId: 'gene-bettercheckout-paywith-text',
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentTypes']),
  },
  async created() {
    await this.getStoreConfig();
    this.payWithText = window.geneCheckout?.[this.payWithTextId] || this.$t('payWithBlockTitle');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
