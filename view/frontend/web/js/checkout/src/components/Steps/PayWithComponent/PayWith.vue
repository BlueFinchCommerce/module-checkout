<template>
  <div
    :style="style"
    class="pay-with__container"
  >
    <TextField
      v-if="isExpressPaymentsVisible"
      class="pay-with__message"
      :text="$t('payWithBlockTitle')"
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
import { mapState } from 'pinia';
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
  computed: {
    ...mapState(usePaymentStore, ['paymentTypes']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
