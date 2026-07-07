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
      <div class="total__row" v-if="!taxCartDisplaySubtotal">
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
      <div v-if="taxCartDisplaySubtotal">
        <div
          class="total__row"
          v-if="Number(taxCartDisplaySubtotal) === 1 || Number(taxCartDisplaySubtotal) === 2"
        >
          <TextField
            class="total__text title"
            :text="$t('orderSummary.subtotalTitle')"
            :data-cy="dataCy ? `subtotal-title-${dataCy}` : 'subtotal-title'"
          />
          <Price
            v-if="Number(taxCartDisplaySubtotal) === 1"
            class="total__text"
            :value="cart.prices.subtotal_excluding_tax.value"
            :data-cy="dataCy ? `subtotal-ex-tax-${dataCy}` : 'subtotal-ex-tax'"
          />
          <Price
            v-else
            class="total__text"
            :value="cart.prices.subtotal_including_tax.value"
            :data-cy="dataCy ? `subtotal-inc-tax-${dataCy}` : 'subtotal-inc-tax'"
          />
        </div>
        <div v-else-if="Number(taxCartDisplaySubtotal) === 3" class="total__both">
          <!-- Excl line -->
          <div class="total__row">
            <TextField
              class="total__text title"
              :text="$t('orderSummary.subtotalTitleExcl')"
              :data-cy="dataCy ? `subtotal-excl-title-${dataCy}` : 'subtotal-excl-title'"
            />
            <Price
              class="total__text"
              :value="cart.prices.subtotal_excluding_tax.value"
              :data-cy="dataCy ? `subtotal-excl-price-${dataCy}` : 'subtotal-excl-price'"
            />
          </div>
          <!-- Incl line -->
          <div class="total__row">
            <TextField
              class="total__text title"
              :text="$t('orderSummary.subtotalTitleIncl')"
              :data-cy="dataCy ? `subtotal-incl-title-${dataCy}` : 'subtotal-incl-title'"
            />
            <Price
              class="total__text"
              :value="cart.prices.subtotal_including_tax.value"
              :data-cy="dataCy ? `subtotal-incl-price-${dataCy}` : 'subtotal-incl-price'"
            />
          </div>
        </div>
      </div>
      <div v-if="cart?.prices?.applied_taxes?.length">
        <div
          class="total__row tax-row"
          v-for="(tax, idx) in cart.prices.applied_taxes"
          :key="idx"
        >
          <TextField
            class="total__text title"
            :text="tax.label"
            :data-cy="dataCy ? `tax-title-${dataCy}-${idx}` : `tax-title-${idx}`"
          />
          <Price
            class="total__text"
            :value="tax.amount.value"
            :currency="tax.amount.currency"
            :data-cy="dataCy ? `tax-price-${dataCy}-${idx}` : `tax-price-${idx}`"
          />
        </div>
      </div>
      <div
        v-for="(discount, index) in (cart?.prices?.discounts || []).filter(d => !(d.label === 'Gift Cards'
        && cart?.applied_gift_cards?.length))"
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
        v-if="cart?.applied_gift_cards?.length"
        class="order-total"
      >
        <div
          v-for="(giftCard, index) in cart.applied_gift_cards"
          :key="'gift-card-' + index"
          class="total__row"
        >
          <TextField
            class="total__text title"
            :text="$t('orderSummary.giftCardDiscount.title')"
            :data-cy="dataCy ? `applied-gift-card-${dataCy}` : 'applied-gift-card'"
          />
          <Price
            class="total__text discount"
            :value="'-' + giftCard.current_balance.value"
            :data-cy="dataCy ? `applied-gift-card-price-${dataCy}` : 'applied-gift-card-price'"
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
      <div v-if="!cart.is_virtual">
        <div
          v-if="!cart.shipping_addresses?.[0]?.selected_shipping_method"
          class="total__row"
        >
          <TextField
            class="total__text title"
            :text="$t('progressBar.shippingStepTitle')"
            :data-cy="dataCy ? `shipping-title-${dataCy}` : 'shipping-title'"
          />
          <TextField
            class="total__text"
            :text="$t('shippingStep.tbc')"
            :data-cy="dataCy ? `shipping-price-tbc-${dataCy}` : 'shipping-price-tbc'"
          />
        </div>
        <template v-else>
          <div
            v-if="Number(taxCartDisplayShipping) === 1 || Number(taxCartDisplayShipping) === 2"
            class="total__row"
          >
            <TextField
              class="total__text title"
              :text="$t('progressBar.shippingStepTitle')"
              :data-cy="dataCy ? `shipping-title-${dataCy}` : 'shipping-title'"
            />
            <Price
              class="total__text"
              :value="Number(taxCartDisplayShipping) === 1
            ? (cart.shipping_addresses[0].selected_shipping_method.amount.value)
            : (cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value
                ?? cart.shipping_addresses[0].selected_shipping_method.amount.value)"
              :data-cy="dataCy ? `shipping-price-${dataCy}` : 'shipping-price'"
            />
          </div>
          <div v-else-if="Number(taxCartDisplayShipping) === 3">
            <div class="total__row">
              <TextField
                class="total__text title"
                :text="$t('orderSummary.shippingStepTitleExcl')"
                :data-cy="dataCy ? `shipping-excl-title-${dataCy}` : 'shipping-excl-title'"
              />
              <Price
                class="total__text"
                :value="cart.shipping_addresses[0].selected_shipping_method.amount.value"
                :data-cy="dataCy ? `shipping-excl-price-${dataCy}` : 'shipping-excl-price'"
              />
            </div>
            <div class="total__row">
              <TextField
                class="total__text title"
                :text="$t('orderSummary.shippingStepTitleIncl')"
                :data-cy="dataCy ? `shipping-incl-title-${dataCy}` : 'shipping-incl-title'"
              />
              <Price
                class="total__text"
                :value="cart.shipping_addresses[0].selected_shipping_method.price_incl_tax.value
              ?? cart.shipping_addresses[0].selected_shipping_method.amount.value"
                :data-cy="dataCy ? `shipping-incl-price-${dataCy}` : 'shipping-incl-price'"
              />
            </div>
          </div>
        </template>
      </div>
      <component
        :is="orderSummaryAdditionalTotalRow"
        v-for="orderSummaryAdditionalTotalRow in orderSummaryAdditionalTotalRows"
        :key="orderSummaryAdditionalTotalRow"
      />
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
import orderSummaryAdditionalTotalRows from '@/extensions/orderSummaryAdditionalTotalRows';

export default {
  name: 'OrderSummaryTotal',
  components: {
    Price,
    TextField,
    ...orderSummaryMessagesContainers(),
    ...orderSummaryAdditionalTotalRows(),
  },
  props: {
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      orderSummaryText: '',
      orderSummaryTextId: 'bluefinch-checkout-ordersummary-text',
      grandTotalText: '',
      grandTotalTextId: 'bluefinch-checkout-grandtotal-text',
      orderSummaryMessagesContainers: [],
      orderSummaryAdditionalTotalRows: [],
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'getCartItemsQty', 'getGiftWrappingTotal']),
    ...mapState(useConfigStore, ['locale', 'taxCartDisplaySubtotal', 'taxCartDisplayShipping']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.orderSummaryText = window.bluefinchCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.grandTotalText = window.bluefinchCheckout?.[this.grandTotalTextId] || this.$t('orderSummary.grandTotalTitle');
    this.orderSummaryMessagesContainers = Object.keys(orderSummaryMessagesContainers());
    this.orderSummaryAdditionalTotalRows = Object.keys(orderSummaryAdditionalTotalRows());
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
