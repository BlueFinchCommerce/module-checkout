<template>
  <SlideUp
    :visible="isModalVisible"
    @close="closeSummary"
  >
    <template #header>
      <OrderSummaryTitleWithAmount
        :order-items-amount="getCartItemsQty"
        :data-cy="deviceType"
      />
      <button
        class="order-summary-close-button"
        :aria-label="$t('orderSummary.closeButton')"
        @click="toggleSummary"
        @keydown="toggleSummary"
        :data-cy="'order-summary-close-button-mobile'"
      >
        <Close :data-cy="'order-summary-close-icon-mobile'"/>
      </button>
    </template>
    <template #body>
      <PromotionComponent :data-cy="deviceType" />
      <CouponDiscount :data-cy="deviceType" />
      <GiftCardDiscount :data-cy="deviceType" />
      <div class="product-items">
        <OrderSummaryItem :data-cy="deviceType" />
      </div>
      <OrderSummaryTotal :data-cy="deviceType" />
    </template>
  </SlideUp>
  <div
    class="is-hidden-desktop is-hidden-tablet order-summary-container"
    :style="style"
    @click="toggleSummary"
    @keydown="toggleSummary"
    data-cy="collapsed-order-summary-trigger-mobile"
  >
    <div
      v-if="cartGrandTotal || getCartItemsQty"
      class="order-summary-header"
    >
      <div class="order-summary-title">
        <TextField
          class="order-summary-title-text"
          :text="orderSummaryText + ':'"
          :data-cy="'collapsed-order-summary-title-mobile'"
        />
        <Price
          v-if="cartGrandTotal !== null"
          class="price"
          :value="cartGrandTotal / 100"
          :data-cy="'collapsed-order-summary-grand-total-mobile'"
        />
        <Price
          class="storyBookEmptyPrice"
          value="532.5"
        />
      </div>
      <div class="order-summary-icon">
        <div class="arrow-up-icon" v-if="isModalVisible">
          <ArrowUp :data-cy="'collapsed-order-summary-arrow-up-mobile'" />
        </div>
        <ArrowDown :data-cy="'collapsed-order-summary-arrow-down-mobile'"
          v-else
        />
      </div>
      <div class="order-summary-description">
        <TextField
          :text="orderSummaryDescriptionText"
          :data-cy="'collapsed-order-summary-description-mobile'"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import SlideUp from '@/components/Core/ActionComponents/SlideUp/SlideUp.vue';
import OrderSummaryItem
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryItem/OrderSummaryItem.vue';
import OrderSummaryTotal
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';
import PromotionComponent
  from '@/components/Steps/GlobalComponents/OrderSummary/PromotionComponent/PromotionComponent.vue';
import GiftCardDiscount
  from '@/components/Steps/GlobalComponents/OrderSummary/GiftCardDiscount/GiftCardDiscount.vue';
import CouponDiscount
  from '@/components/Steps/GlobalComponents/OrderSummary/CouponDiscount/CouponDiscount.vue';
import OrderSummaryTitleWithAmount
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryTitleWithAmount/OrderSummaryTitleWithAmount.vue';

// stores
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import { mapActions, mapState } from 'pinia';

// icons
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import Close from '@/components/Core/Icons/Close/Close.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';

export default {
  name: 'OrderSummaryMobile',
  components: {
    ArrowDown,
    TextField,
    ArrowUp,
    OrderSummaryItem,
    OrderSummaryTotal,
    Price,
    GiftCardDiscount,
    CouponDiscount,
    PromotionComponent,
    SlideUp,
    Close,
    OrderSummaryTitleWithAmount,
  },
  props: {
    backgroundColor: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
      })),
    };
  },
  data() {
    return {
      deviceType: 'mobile',
      isModalVisible: false,
      orderSummaryText: '',
      orderSummaryTextId: 'gene-bettercheckout-ordersummary-text',
      orderSummaryDescriptionText: '',
      orderSummaryDescriptionTextId: 'gene-bettercheckout-ordersummarydescription-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cartGrandTotal', 'getCartItemsQty']),
    ...mapState(useConfigStore, ['storeCode']),
  },
  async created() {
    this.checkForGuestUser();

    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.orderSummaryDescriptionText = window.geneCheckout?.[this.orderSummaryDescriptionTextId]
      || this.$t('orderSummary.mobileDiscountText');

    await this.getInitialConfig();
    await this.getCart();

    await this.getCustomerInformation();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['getCustomerInformation', 'checkForGuestUser']),
    ...mapActions(useCartStore, ['getCart']),
    toggleSummary() {
      this.isModalVisible = !this.isModalVisible;
      if (this.isModalVisible) {
        document.body.classList.add('no-scrollable');
      } else {
        document.body.classList.remove('no-scrollable');
      }
    },
    closeSummary() {
      document.body.classList.remove('no-scrollable');
      this.isModalVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
