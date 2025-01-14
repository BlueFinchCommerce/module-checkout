<template>
  <div
    class="coupon-discount-trigger dropdown-button"
    tabindex="0"
    :data-cy="dataCy ? `coupon-discount-trigger-${dataCy}` : 'coupon-discount-trigger'"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="coupon-discount-icon-container">
      <CouponIcon :data-cy="dataCy"/>
    </div>
    <TextField
      :text="couponDiscountText"
      class="coupon-discount-title"
      :data-cy="dataCy ? `coupon-discount-title-${dataCy}` : 'coupon-discount-title'"
    />
    <ArrowDown
      v-show="!isDropDownVisible"
      class="dropdown-arrow__down"
      :data-cy="dataCy ? `coupon-discount-arrow-down-${dataCy}` : 'coupon-discount-arrow-down'"
    />
    <ArrowUp
      v-show="isDropDownVisible"
      class="dropdown-arrow__up"
      :data-cy="dataCy ? `coupon-discount-arrow-up-${dataCy}` : 'coupon-discount-arrow-up'"
    />
  </div>
  <DropDown
    v-show="isDropDownVisible"
    class="coupon-dropdown"
    :class="{active: isDropDownVisible}"
    :data-cy="dataCy ? `coupon-discount-dropdown-${dataCy}` : 'coupon-discount-dropdown'"
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
          :data-cy="dataCy ? `coupon-discount-input-${dataCy}` : 'coupon-discount-input'"
        />
        <MyButton
          v-if="!cart.applied_coupons?.length"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(discountCode)"
          :data-cy="dataCy ? `coupon-discount-apply-${dataCy}` : 'coupon-discount-apply'"
        />
        <MyButton
          v-if="cart.applied_coupons?.length"
          secondary
          :label="removeButtonText"
          @click="removeDiscountCode"
          :data-cy="dataCy ? `coupon-discount-remove-${dataCy}` : 'coupon-discount-remove'"
        />
        <div class="success">
          <SuccessMessage
            :data-cy="dataCy ? `coupon-discount-success-${dataCy}` : 'coupon-discount-success'"
            v-if="cart.applied_coupons?.length"
            :message="$t('orderSummary.couponDiscount.successMessage', { code: cart.applied_coupons[0].code })"
          />
        </div>
        <div class="error">
          <ErrorMessage
            :data-cy="dataCy ? `coupon-discount-error-${dataCy}` : 'coupon-discount-error'"
            v-if="discountErrorMessage"
            :message="$t('orderSummary.couponDiscount.errorMessage')"
          />
        </div>
      </div>
    </template>
  </DropDown>
</template>
<script>

// components
import DropDown from '@/components/Core/ActionComponents/DropDown/DropDown.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import CouponIcon from '@/components/Core/Icons/CouponIcon/CouponIcon.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import SuccessMessage from '@/components/Core/ContentComponents/Messages/SuccessMessage/SuccessMessage.vue';

// stores
import { mapWritableState, mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useLoadingStore from '@/stores/LoadingStore';

export default {
  name: 'CouponDiscount',
  components: {
    DropDown,
    TextField,
    ArrowDown,
    ArrowUp,
    CouponIcon,
    TextInput,
    MyButton,
    ErrorMessage,
    SuccessMessage,
  },
  props: {
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      isDropDownVisible: false,
      applyButtonText: '',
      applyButtonTextId: 'bluefinch-checkout-applybutton-text',
      removeButtonText: '',
      removeButtonTextId: 'bluefinch-checkout-removebutton-text',
      couponDiscountText: '',
      couponDiscountTextId: 'bluefinch-checkout-coupondiscount-text',
      couponDiscountPlaceholderText: '',
      couponDiscountPlaceholderTextId: 'bluefinch-checkout-coupondiscountplaceholder-text',
    };
  },
  async created() {
    this.applyButtonText = window.bluefinchCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.bluefinchCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.couponDiscountText = window.bluefinchCheckout?.[this.couponDiscountTextId]
      || this.$t('orderSummary.couponDiscountTitle');
    this.couponDiscountPlaceholderText = window.bluefinchCheckout?.[this.couponDiscountPlaceholderTextId]
      || this.$t('orderSummary.couponDiscount.placeholder');

    await this.getInitialConfig();
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'discountErrorMessage']),
    ...mapWritableState(useCartStore, ['discountCode']),
  },
  methods: {
    ...mapActions(useCartStore, ['addDiscountCode', 'removeDiscountCode']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useLoadingStore, ['setLoadingState']),

    async dispatchDiscountCode(discountCode) {
      this.setLoadingState(true);
      await this.addDiscountCode(discountCode);
      this.setLoadingState(false);
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
