<template>
  <button
    class="adyen-checkout__payment-method__header__title"
    :class="{'adyen-checkout__payment-method-disabled': !method.default}"
    :aria-label="$t('adyen.storedPaymentLabel', { name: method.name, lastFour: method.lastFour })"
    type="button"
    :data-original-id="method.originalId"
    @click="selectPaymentCard"
  >
    <Tick
      v-if="method.default"
      class="adyen-checkout__payment-method-tick"
    />
    <TextField
      v-else
      class="adyen-checkout__payment-method-select"
      :text="$t('adyen.select')"
    />
    <span
      class="adyen-checkout__payment-method__radio"
      aria-hidden="true"
    />
    <span
      class="adyen-checkout__payment-method__image__wrapper
        adyen-checkout__payment-method__image__wrapper--outline"
    >
      <img
        class="adyen-checkout__payment-method__image"
        :src="cardLogo"
        :alt="method.name"
      >
    </span>
    <span class="adyen-checkout__payment-method__card-number">{{ $t('adyen.cardNumber') }}</span>
    <span class="adyen-checkout__payment-method__name">
      **** **** **** {{ method.lastFour }}
    </span>
    <span class="adyen-checkout__payment-method__expiry-label">{{ $t('adyen.expiry') }}</span>
    <span class="adyen-checkout__payment-method__expiry">
      {{ method.expiryMonth }}/{{ method.expiryYear }}
    </span>
  </button>
</template>

<script>
import { mapState } from 'pinia';
import usePaymentStore from '@/stores/PaymentStore';

// Components.
import TextField from '@/components/Core/TextField/TextField.vue';
import Tick from '@/components/Core/Icons/Tick/Tick.vue';

export default {
  name: 'AdyenPaymentCard',
  components: {
    TextField,
    Tick,
  },
  props: {
    method: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter']),
    cardLogo() {
      const { brand } = this.method;
      return `//checkoutshopper-live.adyen.com/checkoutshopper/images/logos/${brand}.svg`;
    },
  },
  methods: {
    selectPaymentCard() {
      this.paymentEmitter.emit('adyenStoredPaymentCardSelected', { originalId: this.method.originalId });
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
