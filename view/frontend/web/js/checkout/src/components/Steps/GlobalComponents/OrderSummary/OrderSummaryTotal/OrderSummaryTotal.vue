<template>
  <div class="order-total-title">
    <TextField
      :text="orderSummaryText"
      :data-cy="dataCy ? `order-summary-title-${dataCy}` : 'order-summary-title'"
    />
    <TextField
      v-if="getCartItemsQty > 0"
      class="order-total-title-amount"
      :text="`(${getCartItemsQty})`"
      :data-cy="dataCy ? `order-summary-count-${dataCy}` : 'order-summary-count'"
    />
  </div>
  <div class="order-total-container">
    <div class="order-total-wrapper">
      <div class="total__row">
        <TextField
          class="total__text title"
          :text="$t('orderSummary.subtotalTitle')"
          :data-cy="dataCy ? `subtotal-title-${dataCy}` : 'subtotal-title'"
        />
        <Price
          v-if="cart?.prices?.subtotal_including_tax"
          class="total__text"
          :value="cart.prices.subtotal_including_tax.value"
          :data-cy="dataCy ? `subtotal-price-${dataCy}` : 'subtotal-price'"
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
            :data-cy="dataCy ? `discount-title-${dataCy}` : 'discount-title'"
          />
          <Price
            class="total__text discount"
            :value="'-' + discount.amount.value"
            :data-cy="dataCy ? `discount-price-${dataCy}` : 'discount-price'"
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
          :data-cy="dataCy ? `giftwrap-title-${dataCy}` : 'giftwrap-title'"
        />
        <Price
          class="total__text"
          :value="getGiftWrappingTotal"
          :data-cy="dataCy ? `giftwrap-price-${dataCy}` : 'giftwrap-price'"
        />
      </div>
      <div
        v-if="!cart.is_virtual"
        class="total__row"
      >
        <TextField
          class="total__text title"
          :text="$t('progressBar.shippingStepTitle')"
          :data-cy="dataCy ? `shipping-title-${dataCy}` : 'shipping-title'"
        />
        <Price
          v-if="cart.shipping_addresses?.[0]?.selected_shipping_method"
          class="total__text"
          :value="cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value
            ? cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value
            : cart.shipping_addresses[0].selected_shipping_method.amount.value"
          :data-cy="dataCy ? `shipping-price-${dataCy}` : 'shipping-price'"
        />
        <TextField
          v-else
          class="total__text"
          :text="$t('shippingStep.tbc')"
          :data-cy="dataCy ? `shipping-price-tbc-${dataCy}` : 'shipping-price-tbc'"
        />
      </div>
    </div>
    <div class="order-total-grand">
      <TextField
        class="title"
        :text="grandTotalText"
        :data-cy="dataCy ? `grand-total-title-${dataCy}` : 'grand-total-title'"
        />
      <Price
        :value="cartGrandTotal / 100"
        :data-cy="dataCy ? `grand-total-price-${dataCy}` : 'grand-total-price'"
      />
    </div>
    <component
      :is="orderSummaryMessagesContainer"
      v-for="orderSummaryMessagesContainer in orderSummaryMessagesContainers"
      :key="orderSummaryMessagesContainer"
    />
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

// Extensions
import orderSummaryMessagesContainers from '@/extensions/orderSummaryMessagesContainers';

export default {
  name: 'OrderSummaryTotal',
  components: {
    Price,
    TextField,
    ...orderSummaryMessagesContainers(),
  },
  props: {
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      orderSummaryText: '',
      orderSummaryTextId: 'gene-bettercheckout-ordersummary-text',
      grandTotalText: '',
      grandTotalTextId: 'gene-bettercheckout-grandtotal-text',
      orderSummaryMessagesContainers: [],
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'getCartItemsQty', 'getGiftWrappingTotal']),
    ...mapState(useConfigStore, ['locale', 'taxCartDisplayFullSummary']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.grandTotalText = window.geneCheckout?.[this.grandTotalTextId] || this.$t('orderSummary.grandTotalTitle');
    this.orderSummaryMessagesContainers = Object.keys(orderSummaryMessagesContainers());
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
