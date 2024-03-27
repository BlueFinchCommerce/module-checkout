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
          >
        </div>
        <div class="product-item-info">
          <TextField :text="item?.product?.name" />
          <ProductOptions
            v-if="item?.configurable_options"
            :item="item"
          />
          <div class="product-item-price">
            <Price v-if="item.__typename !== 'GiftCardCartItem'"
              :value="item.product?.price_range?.minimum_price?.final_price?.value" />
            <Price v-else :value="item.amount.value" />
          </div>
          <div class="product-item-actions">
            <QtyButton :item="item" />
            <RemoveItemButton :product="item" />
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
  <div
    v-else
    class="loader__absolute-container"
  >
    <Loader />
  </div>
  <div
    v-if="cartLoading === 'true'"
    class="loader__absolute-container"
  >
    <Loader />
  </div>
</template>
<script>
// store
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';

// icons
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

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
    Loader,
    ErrorMessage,
    ProductOptions,
    QtyButton,
    RemoveItemButton,
  },
  props: {
    response: {
      type: Object,
    },
  },
  computed: {
    ...mapState(useCartStore, ['cartItems', 'cartLoading']),
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/styles.scss";
</style>
