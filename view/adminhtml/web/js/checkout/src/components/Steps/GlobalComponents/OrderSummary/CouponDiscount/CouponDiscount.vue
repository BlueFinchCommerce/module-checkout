<template>
  <div v-if="loadingDiscountCode">
    <Loader />
  </div>
  <div
    class="coupon-discount-trigger dropdown-button"
    tabindex="0"
    data-cy="dropdown-trigger-coupon"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="coupon-discount-icon-container">
      <img
        :src="CouponCodeIcon"
        alt="coupon-dropdown-icon"
      >
    </div>
    <TextField
      :text="couponDiscountText"
      class="coupon-discount-title"
    />
    <ArrowDown
      v-show="!isDropDownVisible"
      class="dropdown-arrow__down"
    />
    <ArrowUp
      v-show="isDropDownVisible"
      class="dropdown-arrow__up"
    />
  </div>
  <DropDown
    v-show="isDropDownVisible"
    class="coupon-dropdown"
    :class="{active: isDropDownVisible}"
  >
    <template #content>
      <div class="field coupon-code-field">
        <TextInput
          v-model="discountCode"
          :error="discountErrorMessage"
          name="coupon-code"
          :placeholder="couponDiscountPlaceholderText"
          :disabled="cart.applied_coupons?.length"
          autocomplete="off"
        />
        <MyButton
          v-if="!cart.applied_coupons?.length"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(discountCode)"
        />

        <MyButton
          v-if="cart.applied_coupons?.length"
          secondary
          :label="removeButtonText"
          @click="removeDiscountCode"
        />
        <div class="success">
          <SuccessMessage
            v-if="cart.applied_coupons?.length"
            :message="$t('orderSummary.couponDiscount.successMessage', { code: cart.applied_coupons[0].code })"
          />
        </div>
        <div class="error">
          <ErrorMessage
            v-if="discountErrorMessage"
            :message="discountErrorMessage"
          />
        </div>
      </div>
    </template>
  </DropDown>
</template>
<script>
// helpers
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// components
import DropDown from '@/components/Core/ActionComponents/DropDown/DropDown.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import SuccessMessage from '@/components/Core/ContentComponents/Messages/SuccessMessage/SuccessMessage.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

// stores
import { mapWritableState, mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import CouponCode from '@/icons/coupon-icon.svg';

export default {
  name: 'CouponDiscount',
  components: {
    DropDown,
    TextField,
    ArrowDown,
    ArrowUp,
    TextInput,
    MyButton,
    ErrorMessage,
    Loader,
    SuccessMessage,
  },
  data() {
    return {
      isDropDownVisible: false,
      loadingDiscountCode: false,
      applyButtonText: '',
      applyButtonTextId: 'gene-bettercheckout-applybutton-text',
      removeButtonText: '',
      removeButtonTextId: 'gene-bettercheckout-removebutton-text',
      couponDiscountText: '',
      couponDiscountTextId: 'gene-bettercheckout-coupondiscount-text',
      couponDiscountPlaceholderText: '',
      couponDiscountPlaceholderTextId: 'gene-bettercheckout-coupondiscountplaceholder-text',
    };
  },
  async created() {
    this.applyButtonText = window.geneCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.geneCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.couponDiscountText = window.geneCheckout?.[this.couponDiscountTextId]
      || this.$t('orderSummary.couponDiscountTitle');
    this.couponDiscountPlaceholderText = window.geneCheckout?.[this.couponDiscountTextId]
      || this.$t('orderSummary.couponDiscount.placeholder');
    document.addEventListener(this.applyButtonTextId, this.setApplyButtonText);
    document.addEventListener(this.removeButtonTextId, this.setRemoveButtonText);
    document.addEventListener(this.couponDiscountTextId, this.setcouponDiscountText);
    document.addEventListener(this.couponDiscountPlaceholderTextId, this.setCouponDiscountPlaceholderText);
  },
  unmounted() {
    document.removeEventListener(this.applyButtonTextId, this.setApplyButtonText);
    document.removeEventListener(this.removeButtonTextId, this.setRemoveButtonText);
    document.removeEventListener(this.couponDiscountTextId, this.setcouponDiscountText);
    document.removeEventListener(this.couponDiscountPlaceholderTextId, this.setCouponDiscountPlaceholderText);
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'discountErrorMessage']),
    ...mapWritableState(useCartStore, ['discountCode']),
    CouponCodeIcon() {
      return `${getStaticUrl(CouponCode)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addDiscountCode', 'removeDiscountCode']),
    ...mapActions(useConfigStore, ['getInitialConfig']),

    setApplyButtonText(event) {
      this.applyButtonText = event?.detail?.value || this.$t('orderSummary.applyBtn');
    },
    setRemoveButtonText(event) {
      this.removeButtonText = event?.detail?.value || this.$t('orderSummary.removeBtn');
    },
    setcouponDiscountText(event) {
      this.couponDiscountText = event?.detail?.value || this.$t('orderSummary.couponDiscountTitle');
    },
    setCouponDiscountPlaceholderText(event) {
      this.couponDiscountPlaceholderText = event?.detail?.value || this.$t('orderSummary.couponDiscount.placeholder');
    },

    async dispatchDiscountCode() {
      // Commented out to prevent functionality only for UI designer
      // this.loadingDiscountCode = true;
      // await this.addDiscountCode(discountCode);
      // this.loadingDiscountCode = false;
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
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
@import "@/styles/core/_dropdown.scss";
</style>
