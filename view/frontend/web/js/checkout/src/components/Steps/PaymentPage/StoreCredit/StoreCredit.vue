<template>
  <div
    v-if="customer?.store_credit?.current_balance?.value && !cart.applied_store_credit?.applied_balance?.value"
    class="store-credit"
  >
    <div>
      <span class="store-credit-available" data-cy="store-credit-text">
        {{
          $t('storeCredit.applyStoreCredit',
             {
               value: getFormattedPrice(),
             })
        }}
      </span>
    </div>
    <MyButton
      :label="$t('storeCredit.applyButton')"
      :data-cy="'use-store-credit-button'"
      secondary
      @click="useStoreCredit()"
    />
  </div>
  <div
    v-else-if="cart.applied_store_credit?.applied_balance?.value"
    class="store-credit"
  >
    <span data-cy="store-credit-used-text">{{ $t('storeCredit.removeStoreCredit') }}</span>
    <MyButton
      :label="$t('storeCredit.removeButton')"
      :data-cy="'remove-store-credit-button'"
      secondary
      @click="removeStoreCredit()"
    />
  </div>
</template>
<script>
// Stores
import { mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import formatPrice from '@/helpers/payment/formatPrice';

export default {
  name: 'StoreCredit',
  components: {
    MyButton,
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useCustomerStore, ['customer']),
  },
  methods: {
    ...mapActions(useCartStore, ['useStoreCredit', 'removeStoreCredit']),
    getFormattedPrice() {
      return formatPrice(this.customer.store_credit.current_balance.value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
