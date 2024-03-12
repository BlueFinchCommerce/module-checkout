<template>
  <div class="order-total-title">
    <TextField :text="orderSummaryText" />
    <TextField
      v-if="getCartItemsQty > 0"
      class="order-total-title-amount"
      :text="`(${getCartItemsQty})`"
    />
  </div>
  <div class="order-total-container">
    <div class="order-total-wrapper">
      <div
        v-for="(discount, index) in cart?.prices?.discounts"
        :key="index"
        class="order-total"
      >
        <div class="total__row">
          <TextField
            class="total__text"
            :text="discount.label"
          />
          <Price
            class="total__text"
            :value="discount.amount.value"
          />
        </div>
      </div>
      <div class="total__row">
        <TextField
          class="total__text"
          :text="$t('progressBar.shippingStepTitle')"
        />
        <Price
          v-if="cart.shipping_addresses?.[0]?.selected_shipping_method"
          class="total__text"
          :value="cart.shipping_addresses[0].selected_shipping_method.amount.value"
        />
        <TextField
          v-else
          class="total__text"
          :text="$t('shippingStep.tbc')"
        />
      </div>
    </div>
    <div class="order-total-grand">
      <TextField :text="grandTotalText" />
      <Price :value="cartGrandTotal / 100" />
    </div>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/TextField/TextField.vue';
import Price from '@/components/Core/Price/Price.vue';

// stores
import { mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

export default {
  name: 'OrderSummaryTotal',
  components: {
    Price,
    TextField,
  },
  data() {
    return {
      orderSummaryText: '',
      orderSummaryTextId: 'gene-bettercheckout-ordersummary-text',
      grandTotalText: '',
      grandTotalTextId: 'gene-bettercheckout-grandtotal-text',
      subtotalText: '',
      subtotalTextId: 'gene-bettercheckout-subtotal-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'getCartItemsQty']),
    ...mapState(useConfigStore, ['taxCartDisplayFullSummary']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  async created() {
    await this.getStoreConfig();
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.grandTotalText = window.geneCheckout?.[this.grandTotalTextId] || this.$t('orderSummary.grandTotalTitle');
    this.subtotalText = window.geneCheckout?.[this.subtotalTextId] || this.$t('orderSummary.subtotalTitle');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
