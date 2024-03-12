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
            v-if="item.product?.options"
            :product="item.product"
          />
          <div class="product-item-price">
            <Price :value="item.product?.price_range?.minimum_price?.final_price?.value" />
          </div>
          <div class="product-item-actions">
            <QtyButton :item="item" />
            <RemoveItemButton :product="item" />
          </div>
          <div
            v-if="item.__typename === 'GiftCardCartItem'"
            class="gift-message"
          >
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.to')" />
              <TextField :text="item.recipient_name" />
            </div>
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.from')" />
              <TextField :text="item.sender_name" />
            </div>
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.message')" />
              <TextField :text="item.message" />
            </div>
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
import Loader from '@/components/Core/Loader/Loader.vue';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import Price from '@/components/Core/Price/Price.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import ProductOptions from '@/components/Steps/OrderSummary/OrderSummaryItem/ProductOptions/ProductOptions.vue';
import QtyButton from '@/components/Steps/OrderSummary/OrderSummaryItem/QtyButton/QtyButton.vue';
import RemoveItemButton from '@/components/Steps/OrderSummary/OrderSummaryItem/RemoveItemButton/RemoveItemButton.vue';

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
@import "@/components/Steps/OrderSummary/OrderSummaryItem/styles.scss";
</style>
