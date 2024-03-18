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
      <div class="total__row">
        <TextField
          class="total__text title"
          :text="$t('orderSummary.subtotalTitle')"
        />
        <Price
          v-if="cart?.prices?.subtotal_including_tax"
          class="total__text"
          :value="cart.prices.subtotal_including_tax.value"
        />
      </div>
      <div
        v-for="(discount, index) in cart?.prices?.discounts"
        :key="index"
        class="order-total"
      >
        <div class="total__row">
          <TextField
            class="total__text title"
            :text="discount.label"
          />
          <Price
            class="total__text discount"
            :value="'-' + discount.amount.value"
          />
        </div>
      </div>
      <div
        v-if="getGiftWrappingTotal"
        class="total__row"
      >
        <TextField
          class="total__text title"
          :text="$t('orderSummary.giftWrappingTitle')"
        />
        <Price
          class="total__text"
          :value="getGiftWrappingTotal"
        />
      </div>
      <div class="total__row">
        <TextField
          class="total__text title"
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
      <TextField class="title" :text="grandTotalText" />
      <Price :value="cartGrandTotal / 100" />
    </div>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';

// stores
import { mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
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
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'getCartItemsQty', 'getGiftWrappingTotal']),
    ...mapState(useConfigStore, ['taxCartDisplayFullSummary']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  async created() {
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.grandTotalText = window.geneCheckout?.[this.grandTotalTextId] || this.$t('orderSummary.grandTotalTitle');
    this.subtotalText = window.geneCheckout?.[this.subtotalTextId] || this.$t('orderSummary.subtotalTitle');

    document.addEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
    document.addEventListener(this.grandTotalTextId, this.setGrandTotalText);
    document.addEventListener(this.subtotalTextId, this.setSubtotalText);
  },
  unmounted() {
    document.removeEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
    document.removeEventListener(this.grandTotalTextId, this.setGrandTotalText);
    document.removeEventListener(this.subtotalTextId, this.setSubtotalText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setOrderSummaryText(event) {
      this.orderSummaryText = event?.detail || this.$t('orderSummary.modalHeader');
    },
    setGrandTotalText(event) {
      this.grandTotalText = event?.detail || this.$t('orderSummary.grandTotalTitle');
    },
    setSubtotalText(event) {
      this.subtotalText = event?.detail || this.$t('orderSummary.subtotalTitle');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
