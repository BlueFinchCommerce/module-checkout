<template>
  <div v-if="Object.keys(cartItems).length !== 0">
    <div class="product-item"
         v-for="(product, index) in cartItems" :key="index">
      <div class="product-item-container">
        <div class="product-image">
          <img :src="product.image.src" :alt="product.image.alt"
               :width="product.image.width" :height="product.image.height">
        </div>
        <div class="product-item-info">
          <TextField :text="product.name" />
          <ProductOptions :product="product" />
          <div class="product-item-price">
            <Price v-if="taxCartDisplayPrice" :value="product.price_incl_tax" />
            <Price v-else :value="product.price" />
          </div>
          <div class="product-item-actions">
            <QtyButton :product="product" />
            <RemoveItemButton :product="product" />
          </div>
          <div v-if="product.giftMessage" class="gift-message">
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.to')"/>
              <TextField :text="product.giftMessage.to"/>
            </div>
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.from')"/>
              <TextField :text="product.giftMessage.from"/>
            </div>
            <div class="gift-message__item">
              <TextField :text="$t('giftMessage.message')"/>
              <TextField :text="product.giftMessage.message"/>
            </div>
          </div>
          <div class="qty-error-message">
            <ErrorMessage v-if="product.cartUpdateErrorMessage" :message="product.cartUpdateErrorMessage"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loader__absolute-container">
    <Loader/>
  </div>
  <div v-if="cartLoading === 'true'"
       class="loader__absolute-container">
    <Loader/>
  </div>
</template>
<script>
// store
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

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
    ...mapState(useConfigStore, ['taxCartDisplayPrice']),
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/Steps/OrderSummary/OrderSummaryItem/styles.scss";
</style>
