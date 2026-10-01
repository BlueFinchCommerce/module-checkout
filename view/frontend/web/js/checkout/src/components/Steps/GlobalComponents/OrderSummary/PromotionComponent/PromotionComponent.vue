<template>
  <div
    v-if="showFreeShippingMessage && (freeShipping > 0 || qualifiesForFreeDelivery)"
    class="promotion-trigger promotion-message"
    :data-cy="dataCy ? `cross-sells-shipping-message-${dataCy}` : 'cross-sells-shipping-message'"
  >
    <div class="promotion-icon-container">
      <PromoIcon
        class="promotion-icon"
        aria-label="promo-dropdown-icon"
        :data-cy="dataCy ? `cross-sells-shipping-icon-${dataCy}` : 'cross-sells-shipping-icon'"
      />
    </div>
    <div class="promo-title no-shipping">
      <div v-if="freeShipping > 0">
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
      <div v-else-if="qualifiesForFreeDelivery">
        <TextField
          class="bold"
          :text="$t('orderSummary.freeShippingAvailable')"
          :data-cy="dataCy ? `cross-sells-shipping-qualified-text-${dataCy}` : 'cross-sells-shipping-qualified-text'"
        />
      </div>
    </div>
  </div>

  <div
    v-if="crosssells.length > 0"
    class="promotion-trigger dropdown-button crosssells-trigger"
    tabindex="0"
    :class="{opened: crosSellsOpened}"
    :data-cy="dataCy ? `cross-sells-trigger-${dataCy}` : 'cross-sells-trigger'"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div
      v-if="displayCrossSellsIcon"
      class="promotion-icon-container">
      <PromoIcon
        class="promotion-icon"
        aria-label="promo-dropdown-icon"
        :data-cy="dataCy ? `cross-sells-shipping-icon-${dataCy}` : 'cross-sells-shipping-icon'"
      />
    </div>
    <div class="promo-title crosssells">
      <div>
        <TextField
          :text="displayCrossSellsText"
          :data-cy="dataCy ? `cross-sells-title-${dataCy}` : 'cross-sells-title'"
        />
      </div>
      <ArrowDown
        v-if="!crosSellsOpened && crosssells.length"
        class="dropdown-arrow__down"
        :data-cy="dataCy ? `cross-sells-arrow-down-${dataCy}` : 'cross-sells-arrow-down'"
      />
      <ArrowUp
        v-if="crosSellsOpened && crosssells.length"
        class="dropdown-arrow__up"
        :data-cy="dataCy ? `cross-sells-arrow-up-${dataCy}` : 'cross-sells-arrow-up'"
      />
    </div>
  </div>
  <DropDown
    v-if="crosSellsOpened && crosssells.length"
    class="promo-dropdown crosssells-dropdown"
    :class="{active: crosSellsOpened}"
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
              :label="displayCrossSellsCTAText"
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
import PromoIcon from '@/components/Core/Icons/PromoIcon/PromoIcon.vue';

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
    PromoIcon,
  },
  props: {
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      crossSellsTextId: 'bluefinch-checkout-crosssells-text',
      crossSellsCTATextId: 'bluefinch-checkout-crosssells-cta-text',
      displayCrossSellsText: '',
      displayCrossSellsCTAText: '',
      originalCrossSellsText: '',
      originalCrossSellsCTAText: '',
      displayCrossSellsIcon: false,
    };
  },
  computed: {
    ...mapState(useConfigStore, ['locale', 'crosSellsOpened', 'showFreeShippingMessage']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'crosssells', 'freeShipping']),
    qualifiesForFreeDelivery() {
      return this.freeShipping === 0;
    },
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.originalCrossSellsText = window.bluefinchCheckout?.[this.crossSellsTextId]
     || this.$t('orderSummary.crossSellsTitle');
    this.displayCrossSellsText = this.originalCrossSellsText;

    this.originalCrossSellsCTAText = window.bluefinchCheckout?.[this.crossSellsCTATextId]
      || this.$t('orderSummary.addToCart');
    this.displayCrossSellsCTAText = this.originalCrossSellsCTAText;

    await this.getCart();
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
    ...mapActions(useConfigStore, ['getInitialConfig', 'setCrosSellsVisibility']),
    ...mapActions(useCartStore, [
      'getCart', 'getCrosssells', 'addCartItem',
    ]),
    openDropDown() {
      this.setCrosSellsVisibility(!this.crosSellsOpened);
    },
    openDropDownKeyDown(event) {
      // Check if the event is a click or if the key pressed is "Enter" (key code 13)
      if (event.type === 'keydown' && event.key === 'Enter') {
        this.setCrosSellsVisibility(!this.crosSellsOpened);
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
