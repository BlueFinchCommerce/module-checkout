<template>
  <SlideUp
    :visible="isModalVisible"
    @close="closeSummary"
  >
    <template #header>
      <OrderSummaryTitleWithAmount :order-items-amount="getCartItemsQty" />
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
      <PromotionComponent />
      <CouponDiscount />
      <GiftCardDiscount />
      <div class="product-items">
        <OrderSummaryItem />
      </div>
      <OrderSummaryTotal />
    </template>
  </SlideUp>
  <div
    class="is-hidden-desktop is-hidden-tablet order-summary-container"
    :style="style"
    @click="toggleSummary"
    @keydown="toggleSummary"
  >
    <div
      v-if="cartGrandTotal || getCartItemsQty"
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
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
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
    ...mapState(useCartStore, ['cartGrandTotal', 'getCartItemsQty']),
    ...mapState(useConfigStore, ['storeCode']),
  },
  async created() {
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    this.orderSummaryDescriptionText = window.geneCheckout?.[this.orderSummaryDescriptionTextId]
      || this.$t('orderSummary.mobileDiscountText');

    document.addEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
    document.addEventListener(this.orderSummaryDescriptionTextId, this.setOrderSummaryDescriptionText);
  },
  unmounted() {
    document.removeEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
    document.removeEventListener(this.orderSummaryDescriptionTextId, this.setOrderSummaryDescriptionText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
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
    setOrderSummaryText(event) {
      this.orderSummaryText = event?.detail || this.$t('orderSummary.modalHeader');
    },
    setOrderSummaryDescriptionText(event) {
      this.orderSummaryDescriptionText = event?.detail || this.$t('orderSummary.mobileDiscountText');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
