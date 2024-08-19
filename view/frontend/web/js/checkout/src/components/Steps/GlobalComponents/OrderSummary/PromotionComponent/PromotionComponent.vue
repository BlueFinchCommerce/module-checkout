<template>
    <div
      class="promotion-trigger dropdown-button"
      tabindex="0"
      v-if="freeShipping > 0 && crosssells.length === 0"
      :class="{opened: isDropDownVisible}"
      :data-cy="dataCy ? `cross-sells-shipping-trigger-${dataCy}` : 'cross-sells-shipping-trigger'"
      @click="openDropDown"
      @keydown="openDropDownKeyDown($event)"
    >
      <div class="promotion-icon-container">
        <img
          :src="promoIconUrl"
          alt="promo-dropdown-icon"
          :data-cy="dataCy ? `cross-sells-shipping-icon-${dataCy}` : 'cross-sells-shipping-icon'"
        >
      </div>
      <div class="promo-title no-shipping">
        <div>
          <TextField
            :text="$t('orderSummary.couponCodeTitle')"
            :data-cy="dataCy ? `cross-sells-shipping-pre-text-${dataCy}` : 'cross-sells-shipping-pre-text'"
          />
          <Price
            class="bold"
            :value="freeShipping"
            :data-cy="dataCy ? `cross-sells-shipping-price-${dataCy}` : 'cross-sells-shipping-price'"
          />
          <TextField
            :text="$t('orderSummary.couponCodeTitleBottom')"
            :data-cy="dataCy ? `cross-sells-shipping-post-text-${dataCy}` : 'cross-sells-shipping-post-text'"
          />
          <TextField
            class="bold"
            :text="$t('orderSummary.couponCodeTitleFreeShipping')"
            :data-cy="dataCy ?
            `cross-sells-shipping-post-additional-text-${dataCy}` :
            'cross-sells-shipping-post-additional-text'"
          />
        </div>
      </div>
      <ArrowDown
        v-if="!isDropDownVisible && crosssells.length"
        class="dropdown-arrow__down"
        :data-cy="dataCy ? `cross-sells-shipping-arrow-down-${dataCy}` : 'cross-sells-shipping-arrow-down'"
      />
      <ArrowUp
        v-if="isDropDownVisible && crosssells.length"
        class="dropdown-arrow__up"
        :data-cy="dataCy ? `cross-sells--shipping-arrow-up-${dataCy}` : 'cross-sells-shipping-arrow-up'"
      />
    </div>

    <div
      v-if="!freeShipping && crosssells.length > 0"
      class="promotion-trigger dropdown-button"
      tabindex="0"
      :class="{opened: isDropDownVisible}"
      :data-cy="dataCy ? `cross-sells-trigger-${dataCy}` : 'cross-sells-trigger'"
      @click="openDropDown"
      @keydown="openDropDownKeyDown($event)"
    >
      <div
        v-if="displayCrossSellsIcon"
        class="promotion-icon-container">
        <img
          :src="promoIconUrl"
          alt="promo-dropdown-icon"
          :data-cy="dataCy ? `cross-sells-shipping-icon-${dataCy}` : 'cross-sells-shipping-icon'"
        >
      </div>
      <div class="promo-title crosssells">
        <div>
          <TextField
            :text="displayCrossSellsText"
            :data-cy="dataCy ? `cross-sells-title-${dataCy}` : 'cross-sells-title'"
          />
        </div>
        <ArrowDown
          v-if="!isDropDownVisible && crosssells.length"
          class="dropdown-arrow__down"
          :data-cy="dataCy ? `cross-sells-arrow-down-${dataCy}` : 'cross-sells-arrow-down'"
        />
        <ArrowUp
          v-if="isDropDownVisible && crosssells.length"
          class="dropdown-arrow__up"
          :data-cy="dataCy ? `cross-sells-arrow-up-${dataCy}` : 'cross-sells-arrow-up'"
        />
      </div>
    </div>
    <DropDown
      v-if="isDropDownVisible && crosssells.length"
      class="promo-dropdown"
      :class="{active: isDropDownVisible}"
      :data-cy="dataCy ? `cross-sells-dropdown-${dataCy}` : 'cross-sells-dropdown'"
    >
      <template #content>
        <div
          :class="['product-item-carousel', `product-item-carousel-${crosssells.length}`]"
          :data-cy="dataCy ? `cross-sells-carousel-${dataCy}` : 'cross-sells-carousel'"
          >
          <div
            v-for="(product, index) in crosssells"
            :key="index"
            class="product-item"
          >
            <div class="product-item-image">
              <img
                :src="product.thumbnail.url"
                :alt="product.thumbnail.label"
                :data-cy="dataCy ? `cross-sells-product-image-${dataCy}` : 'cross-sells-product-image'"
              >
            </div>
            <div class="product-item-info">
              <TextField
                :text="product.name"
                class="product-item-name"
                :data-cy="dataCy ? `cross-sells-product-title-${dataCy}` : 'cross-sells-product-title'"
              />
              <Price
                class="product-item-price"
                :value="product.price_range.minimum_price.final_price.value"
                :data-cy="dataCy ? `cross-sells-product-price-${dataCy}` : 'cross-sells-product-price'"
              />
            </div>
            <div class="product-actions">
              <MyButton
                primary
                :label="$t('orderSummary.addToCart')"
                @click="addItem(product)"
                :data-cy="dataCy ? `cross-sells-add-to-basket-${dataCy}` : 'cross-sells-add-to-basket'"
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

// Extensions
import functionExtension from '@/extensions/functionExtension';

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
  props: {
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      isDropDownVisible: false,
      crossSellsTextId: 'gene-bettercheckout-crosssells-text',
      displayCrossSellsText: '',
      originalCrossSellsText: '',
      displayCrossSellsIcon: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'crosssells', 'freeShipping', 'amastyEnabled']),
    promoIconUrl() {
      return `${getStaticUrl(promoSvg)}`;
    },
  },
  async created() {
    this.originalCrossSellsText = window.geneCheckout?.[this.crossSellsTextId]
     || this.$t('orderSummary.crossSellsTitle');
    this.displayCrossSellsText = this.originalCrossSellsText;

    await this.getInitialConfig();
    await this.getCart();
    if (this.amastyEnabled) {
      await this.getAmastyShippingData();
    }
    await this.getCrosssells();
    this.externalCrosssellHeader();

    const cartStore = useCartStore();
    cartStore.$subscribe((mutation) => {
      if (mutation.payload && 'cart' in mutation.payload) {
        this.externalCrosssellHeader();
      }
    });
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCartStore, [
      'getCart', 'getCrosssells', 'getAmastyShippingData', 'addCartItem',
    ]),
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

    async externalCrosssellHeader() {
      const grandTotal = this.cartGrandTotal / 100;

      const [text, showIcon] = await functionExtension('getCrossSellsHeader', [
        this.originalCrossSellsText,
        this.displayCrossSellsIcon, grandTotal,
      ]);

      if (text) {
        this.displayCrossSellsText = text;
        this.displayCrossSellsIcon = showIcon;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
