<template>
  <SlideUp
    :visible="isModalVisible"
    @close="closeSummary"
  >
    <template #header>
      <OrderSummaryTitleWithAmount :order-items-amount="cartItemsQty" />
      <button
        class="order-summary-close-button"
        :aria-label="$t('orderSummary.closeButton')"
        @click="toggleSummary"
        @keydown="toggleSummary"
      >
        <Close />
      </button>
    </template>
    <template #body>
      <CouponDiscount />
      <GiftCardDiscount />
      <div class="product-items">
        <OrderSummaryItem />
      </div>
      <OrderSummaryTotal />
      <PromotionComponent />
    </template>
  </SlideUp>
  <div
    class="is-hidden-desktop is-hidden-tablet order-summary-container"
    :style="style"
    @click="toggleSummary"
    @keydown="toggleSummary"
  >
    <div
      v-if="cartGrandTotal || cartItemsQty"
      class="order-summary-header"
    >
      <div class="order-summary-title">
        <TextField
          class="order-summary-title-text"
          :text="orderSummaryText + ': '"
        />
        <Price
          v-if="cartGrandTotal !== null"
          class="price"
          :value="cartGrandTotal / 100"
        />
        <Price
          class="storyBookEmptyPrice"
          value="532.5"
        />
      </div>
      <div class="order-summary-icon">
        <div class="arrow-up-icon" v-if="isModalVisible">
          <ArrowUp/>
        </div>
        <ArrowDown
          v-else
        />
      </div>
      <div class="order-summary-description">
        <TextField
          :text="orderSummaryDescriptionText"
        />
      </div>
    </div>
    <div v-else>
      <Loader />
    </div>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import SlideUp from '@/components/Core/SlideUp/SlideUp.vue';
import OrderSummaryItem
  from '@/components/Steps/OrderSummary/OrderSummaryItem/OrderSummaryItem.vue';
import OrderSummaryTotal
  from '@/components/Steps/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.vue';
import Price from '@/components/Core/Price/Price.vue';
import PromotionComponent
  from '@/components/Steps/OrderSummary/PromotionComponent/PromotionComponent.vue';
import GiftCardDiscount
  from '@/components/Steps/OrderSummary/GiftCardDiscount/GiftCardDiscount.vue';
import CouponDiscount
  from '@/components/Steps/OrderSummary/CouponDiscount/CouponDiscount.vue';
import OrderSummaryTitleWithAmount
  from '@/components/Steps/OrderSummary/OrderSummaryTitleWithAmount/OrderSummaryTitleWithAmount.vue';

// stores
import useConfigStore from '@/stores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import { mapActions, mapState } from 'pinia';

// icons
import Loader from '@/components/Core/Loader/Loader.vue';
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
    Loader,
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
      isModalVisible: false,
      orderSummaryText: '',
      orderSummaryTextId: 'gene-bettercheckout-ordersummary-text',
      orderSummaryDescriptionText: '',
      orderSummaryDescriptionTextId: 'gene-bettercheckout-ordersummarydescription-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cartGrandTotal', 'cartItemsQty']),
  },
  async created() {
    this.checkForGuestUser();
    await this.getStoreConfig();
    await this.getCartData();
    await this.getCart();
    await this.getCustomerInformation();
    this.getCartTotals();
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.orderSummaryDescriptionText = window.geneCheckout?.[this.orderSummaryDescriptionTextId]
      || this.$t('orderSummary.mobileDiscountText');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['getCustomerInformation', 'checkForGuestUser']),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals']),
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
