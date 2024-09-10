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
          <ProductOptions
            v-if="item?.configurable_options"
            :item="item"
            :data-cy="dataCy ? `product-options-${dataCy}` : 'product-options'"
          />
          <div class="product-item-price">
            <Price v-if="item.__typename !== 'GiftCardCartItem'"
              :value="item.prices?.row_total_including_tax?.value"
              :data-cy="dataCy ? `product-price-${dataCy}` : 'product-price'"
            />
            <Price v-else
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
              :item="{
                configurable_options: [
                  {
                    option_label: $t('giftMessage.to'),
                    value_label: item.recipient_name
                  },
                  {
                    option_label: $t('giftMessage.from'),
                    value_label: item.sender_name
                  },
                  {
                    option_label: $t('giftMessage.message'),
                    value_label: item.message
                  },
                ]
              }"
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
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/styles.scss";
</style>
