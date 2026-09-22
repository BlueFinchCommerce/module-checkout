<template>
  <div v-if="Object.keys(cartItems).length !== 0">
    <div
      v-for="(item, index) in cartItems"
      :key="index"
      class="product-item"
    >
      <div class="product-item-container">
        <div class="product-image">
          <img
            :src="item.product?.thumbnail?.url"
            :alt="item.product?.thumbnail?.label"
            :data-cy="dataCy ? `product-image-${dataCy}` : 'product-image'"
          >
        </div>
        <div class="product-item-info">
          <TextField
            :text="item?.product?.name"
            :data-cy="dataCy ? `product-name-${dataCy}` : 'product-name'"
          />
          <div
            v-if="item?.order_summary_messages?.length"
            class="order-summary-item-messages"
          >
            <p
              v-for="(message, messageIndex) in item.order_summary_messages"
              :key="message.id || messageIndex"
              class="order-summary-item-message"
              :class="[
                message.className,
                `order-summary-item-message--${message.type || 'info'}`,
              ]"
              v-text="message.text"
            />
          </div>
          <ProductOptions
            v-if="item?.configurable_options || item?.customizable_options"
            :item="item"
            :data-cy="dataCy ? `product-options-${dataCy}` : 'product-options'"
          />
          <div class="product-item-price">
            <template v-if="item.__typename !== 'GiftCardCartItem'">
              <div
                v-for="price in itemPrices(item)"
                :key="price.taxMode"
                class="product-item-price-row"
              >
                <Price
                  :value="price.value"
                  :data-cy="dataCy
                    ? `product-price-${price.taxMode}-${dataCy}`
                    : `product-price-${price.taxMode}`"
                />
                <span class="product-item-price-tax-label">{{ price.label }}</span>
              </div>
            </template>
            <Price
              v-else
              :value="item.amount.value"
              :data-cy="dataCy ? `product-price-${dataCy}` : 'product-price'"
            />
          </div>
          <div class="product-item-actions">
            <QtyButton
              :item="item"
              :data-cy="dataCy ? `qty-component-${dataCy}` : 'qty-component'"
            />
            <RemoveItemButton
              :product="item"
              :data-cy="dataCy ? `remove-item-component-${dataCy}` : 'remove-item-component'"
            />
          </div>
          <div
            v-if="item.__typename === 'GiftCardCartItem'"
            class="gift-message"
          >
            <ProductOptions
              :item="{ configurable_options: giftCardOptions(item) }"
              :data-cy="dataCy ? `product-options-${dataCy}` : 'product-options'"
            />
          </div>
          <div
            v-if="item?.errors"
            class="qty-error-message"
          >
            <template
              v-for="error in item.errors"
              :key="error.message"
            >
              <ErrorMessage
                :attached="false"
                :message="error.message"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// store
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import ProductOptions
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/ProductOptions/ProductOptions.vue';
import QtyButton
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/QtyButton/QtyButton.vue';
import RemoveItemButton
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/RemoveItemButton/RemoveItemButton.vue';

export default {
  name: 'OrderSummaryItem',
  components: {
    TextField,
    Price,
    ErrorMessage,
    ProductOptions,
    QtyButton,
    RemoveItemButton,
  },
  props: {
    response: {
      type: Object,
    },
    dataCy: {
      type: String,
    },
  },
  computed: {
    ...mapState(useCartStore, ['cartItems']),
    ...mapState(useConfigStore, ['taxCartDisplayPrice']),
  },
  methods: {
    giftCardOptions(item) {
      const options = [
        {
          option_label: this.$t('giftMessage.to'),
          value_label: item.recipient_name,
        },
        {
          option_label: this.$t('giftMessage.from'),
          value_label: item.sender_name,
        },
      ];
      const message = typeof item.message === 'string' ? item.message.trim() : '';

      if (message) {
        options.push({
          option_label: this.$t('giftMessage.message'),
          value_label: message,
        });
      }

      return options;
    },
    itemPrices(item) {
      const excludingTax = item.prices?.row_total?.value;
      const includingTax = item.prices?.row_total_including_tax?.value;
      const displayMode = Number(this.taxCartDisplayPrice);
      const prices = [];

      if ((displayMode === 1 || displayMode === 3) && excludingTax !== undefined) {
        prices.push({
          label: this.$t('orderSummary.priceTitleExcl'),
          taxMode: 'excluding-tax',
          value: excludingTax,
        });
      }

      if ((displayMode === 2 || displayMode === 3) && includingTax !== undefined) {
        prices.push({
          label: this.$t('orderSummary.priceTitleIncl'),
          taxMode: 'including-tax',
          value: includingTax,
        });
      }

      if (!prices.length) {
        prices.push({
          label: this.$t('orderSummary.priceTitleIncl'),
          taxMode: 'including-tax',
          value: includingTax ?? excludingTax,
        });
      }

      return prices;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/styles.scss";

.product-item-price-row {
  display: flex;
  align-items: baseline;
  gap: var(--indent__xs);
}

.product-item-price-tax-label {
  display: var(--tax-label-display, none);
  font-size: var(--font__xs);
  font-weight: var(--font-weight__regular);
}
</style>
