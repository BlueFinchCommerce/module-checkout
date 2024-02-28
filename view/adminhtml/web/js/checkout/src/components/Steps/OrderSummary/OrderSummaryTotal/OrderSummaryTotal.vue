<template>
  <div class="order-total-title">
    <TextField :text="orderSummaryText" />
    <TextField
      v-if="cartItemsQty > 0"
      class="order-total-title-amount"
      :text="`(${cartItemsQty})`"
    />
  </div>
  <div class="order-total-container">
    <div class="order-total-wrapper">
      <div
        v-for="(total, index) in totalSegments"
        :key="index"
        class="order-total"
      >
        <div
          v-if="total.code === 'penniesdonation'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
        <div
          v-if="total.code === 'shipping'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('progressBar.shippingStepTitle')"
          />
          <Price
            v-if="selectedMethod.method_code"
            class="total__text"
            :value="shippingPrice"
          />
          <TextField
            v-else
            class="total__text"
            :text="$t('shippingStep.tbc')"
          />
        </div>
        <div
          v-else-if="total.code === 'discount'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
        <div
          v-else-if="total.code === 'giftcardaccount'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
        <div
          v-else-if="total.code === 'reward' && total.value"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.rewardsTitle')"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
        <div
          v-else-if="total.code === 'subtotal'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="subtotalText"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
        <div
          v-else-if="total.code === 'giftwrapping'
            && total.extension_attributes.gw_base_price > 0 "
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.discountTitle')"
          />
          <Price
            class="total__text"
            :value="total.extension_attributes.gw_base_price"
          />
        </div>
        <div
          v-else-if="total.code === 'tax' && taxCartDisplayFullSummary"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.inclTaxTitle')"
          />
          <Price
            class="total__text"
            :value="total.value"
          />
        </div>
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
    ...mapState(useCartStore, ['cartGrandTotal', 'totalSegments', 'shippingPrice', 'cartItemsQty']),
    ...mapState(useConfigStore, ['taxCartDisplayFullSummary']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  async created() {
    await this.getStoreConfig();
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
