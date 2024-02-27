<template>
  <div
    class="promotion-trigger dropdown-button"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDown"
  >
    <div class="promotion-icon-container">
      <img
        :src="promoIconUrl"
        alt="promo-dropdown-icon"
      >
    </div>
    <div
      v-if="freeShipping > 0"
      class="promo-title no-shipping"
    >
      <div>
        <TextField
          :text="$t('orderSummary.couponCodeTitle')"
          font-weight="325"
        />
        <Price
          :value="freeShipping"
        />
        <TextField
          :text="$t('orderSummary.couponCodeTitleBottom')"
          font-weight="325"
        />
        <TextField
          :text="$t('orderSummary.couponCodeTitleFreeShipping')"
        />
      </div>
    </div>
    <div
      v-else
      class="promo-title"
    >
      <div>
        <TextField
          :text="freeShippingText"
        />
      </div>
    </div>
    <ArrowDown
      v-if="!isDropDownVisible && crosssells.length"
      class="dropdown-arrow__down"
      stroke="black"
    />
    <ArrowUp
      v-if="isDropDownVisible && crosssells.length"
      class="dropdown-arrow__up"
      stroke="black"
    />
  </div>

  <DropDown
    v-if="isDropDownVisible && crosssells.length"
    class="promo-dropdown"
    :class="{active: isDropDownVisible}"
  >
    <template #content>
      <TextField
        class="promo-title"
        :text="$t('orderSummary.promoTitle')"
        font-weight="500"
        font-size="16px"
      />
      <div :class="['product-item-carousel', `product-item-carousel-${crosssells.length}`]">
        <div
          v-for="(product, index) in crosssells"
          :key="index"
          class="product-item"
        >
          <div class="product-item-image">
            <img
              :src="product.thumbnail.url"
              :alt="product.thumbnail.label"
            >
          </div>
          <div class="product-item-info">
            <Price
              :value="product.price_range.minimum_price.final_price.value"
              font-size="18px"
              font-weight="500"
            />
            <TextField
              :text="product.name"
              class="product-item-name"
              font-weight="325"
              font-size="14px"
            />
          </div>
          <div class="product-actions">
            <MyButton
              primary
              :label="$t('orderSummary.addToCart')"
              @click="addItem(product)"
            />
          </div>
        </div>
      </div>
    </template>
  </DropDown>
</template>
<script>
// stores
import { mapActions, mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

// components
import Price from '@/components/Core/Price/Price.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import MyButton from '@/components/Core/Button/Button.vue';
import DropDown from '@/components/Core/DropDown/DropDown.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';

// icons
import promoSvg from '@/components/Steps/OrderSummary/PromotionComponent/images/promo-icon.svg';
import getStaticUrl from '@/helpers/getStaticPath';

export default {
  name: 'PromotionComponent',
  components: {
    Price,
    TextField,
    MyButton,
    DropDown,
    ArrowUp,
    ArrowDown,
  },
  data() {
    return {
      isDropDownVisible: false,
      freeShippingText: '',
      freeShippingTextId: 'gene-bettercheckout-freeshipping-text'
    };
  },
  async created() {
    await this.getStoreConfig();
    this.freeShippingText = window.geneCheckout?.[this.freeShippingTextId] || this.$t('orderSummary.freeShippingAvailable')

    document.addEventListener(this.freeShippingTextId, this.setFreeShippingText)
  },
  unmounted() {
    document.removeEventListener(this.freeShippingTextId, this.setFreeShippingText);
  },
  computed: {
    ...mapState(useCartStore, ['crosssells', 'freeShipping']),
    promoIconUrl() {
      return `${getStaticUrl(promoSvg)}`;
    },
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCartStore, [
      'getCartData', 'getCartTotals', 'getCrosssells', 'getAmastyShippingData', 'addCartItem',
    ]),

    setFreeShippingText(event) {
      this.freeShippingText = event?.detail || this.$t('orderSummary.freeShippingAvailable');
    },
    openDropDown() {
      this.isDropDownVisible = !this.isDropDownVisible;
    },
    async addItem(product) {
      await this.addCartItem(product);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
