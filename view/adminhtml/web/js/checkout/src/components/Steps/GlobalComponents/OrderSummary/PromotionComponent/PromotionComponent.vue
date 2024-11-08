<template>
  <div
    class="promotion-trigger dropdown-button"
    tabindex="0"
    v-if="freeShipping > 0 && crosssells.length === 0"
    :class="{opened: isDropDownVisible}"
    data-cy="dropdown-trigger"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="promotion-icon-container">
      <img
        :src="promoIconUrl"
        alt="promo-dropdown-icon"
      >
    </div>
    <div class="promo-title no-shipping">
      <div>
        <TextField
          :text="$t('orderSummary.couponCodeTitle')"
        />
        <Price
          class="bold"
          :value="freeShipping"
        />
        <TextField
          :text="$t('orderSummary.couponCodeTitleBottom')"
        />
        <TextField
          class="bold"
          :text="$t('orderSummary.couponCodeTitleFreeShipping')"
        />
      </div>
    </div>
    <ArrowDown
      v-if="!isDropDownVisible && crosssells.length"
      class="dropdown-arrow__down"
    />
    <ArrowUp
      v-if="isDropDownVisible && crosssells.length"
      class="dropdown-arrow__up"
    />
  </div>

  <div
    class="promotion-trigger dropdown-button"
    tabindex="0"
    :class="{opened: isDropDownVisible}"
    data-cy="dropdown-trigger"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="promo-title crosssells">
      <div>
        <TextField
          :text="crossSellsText"
        />
      </div>
      <ArrowDown
        v-if="!isDropDownVisible && crosssells.length"
        class="dropdown-arrow__down"
      />
      <ArrowUp
        v-if="isDropDownVisible && crosssells.length"
        class="dropdown-arrow__up"
      />
    </div>
  </div>
  <DropDown
    v-if="isDropDownVisible && crosssells.length"
    class="promo-dropdown"
    :class="{active: isDropDownVisible}"
  >
    <template #content>
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
            <TextField
              :text="product.name"
              class="product-item-name"/>
            <Price class="product-item-price" :value="product.price_range.minimum_price.final_price.value"/>
          </div>
          <div class="product-actions">
            <MyButton
              primary
              :label="crossSellsCTAText"
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
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// components
import Price from '@/components/Core/ContentComponents/Price/Price.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import DropDown from '@/components/Core/ActionComponents/DropDown/DropDown.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';

// icons
import promoSvg from '@/components/Steps/GlobalComponents/OrderSummary/PromotionComponent/images/promo-icon.svg';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

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
      crossSellsText: '',
      crossSellsCTAText: '',
      crossSellsTextId: 'gene-bettercheckout-crosssells-text',
      crossSellsCTATextId: 'gene-bettercheckout-crosssells-cta-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['crosssells', 'freeShipping']),
    promoIconUrl() {
      return `${getStaticUrl(promoSvg)}`;
    },
  },
  async created() {
    this.crossSellsText = window.geneCheckout?.[this.crossSellsTextId]
     || this.$t('orderSummary.crossSellsTitle');

    this.crossSellsCTAText = window.geneCheckout?.[this.crossSellsCTATextId]
      || this.$t('orderSummary.addToCart');

    document.addEventListener(this.crossSellsTextId, this.setCrossSellsText);
    document.addEventListener(this.crossSellsCTATextId, this.setCrossSellsCTAText);
  },
  unmounted() {
    document.removeEventListener(this.crossSellsTextId, this.setCrossSellsText);
    document.removeEventListener(this.crossSellsCTATextId, this.setCrossSellsCTAText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCartStore, [
      'getCart', 'getCrosssells', 'getAmastyShippingData', 'addCartItem',
    ]),

    setCrossSellsText(event) {
      this.crossSellsText = event?.detail?.value || this.$t('orderSummary.crossSellsTitle');
    },
    setCrossSellsCTAText(event) {
      this.crossSellsCTAText = event?.detail?.value || this.$t('orderSummary.addToCart');
    },

    openDropDown() {
      this.isDropDownVisible = !this.isDropDownVisible;
    },
    openDropDownKeyDown(event) {
      // Check if the event is a click or if the key pressed is "Enter" (key code 13)
      if (event.type === 'keydown' && event.key === 'Enter') {
        this.isDropDownVisible = !this.isDropDownVisible;
      }
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
