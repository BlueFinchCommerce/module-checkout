<template>
  <div v-if="loadingDiscountCode">
    <Loader />
  </div>
  <div
    class="coupon-discount-trigger dropdown-button"
    data-cy="dropdown-trigger-coupon"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDown"
  >
    <div class="coupon-discount-icon-container">
      <img
        :src="GiftIcon"
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
      stroke="black"
    />
    <ArrowUp
      v-show="isDropDownVisible"
      class="dropdown-arrow__up"
      stroke="black"
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
          :disabled="discountApplied"
          autocomplete="off"
        />
        <MyButton
          v-if="!discountApplied"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(discountCode)"
        />

        <MyButton
          v-if="discountApplied"
          secondary
          :label="removeButtonText"
          @click="removeDiscountCode"
        />
        <div class="success">
          <SuccessMessage
            v-if="discountApplied"
            :message="$t('orderSummary.couponDiscount.successMessage', { code: discountCode })"
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
import getStaticUrl from '@/helpers/getStaticPath';

// components
import DropDown from '@/components/Core/DropDown/DropDown.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/Button/Button.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import SuccessMessage from '@/components/Core/Messages/SuccessMessage/SuccessMessage.vue';
import Loader from '@/components/Core/Loader/Loader.vue';

// stores
import { mapWritableState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import GiftIcon from '@/icons/gift-icon.svg';

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
      isDropDownVisible: true,
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
    await this.getStoreConfig();
    this.applyButtonText = window.geneCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.geneCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.couponDiscountText = window.geneCheckout?.[this.couponDiscountTextId]
      || this.$t('orderSummary.couponDiscountTitle');
    this.couponDiscountPlaceholderText = window.geneCheckout?.[this.couponDiscountTextId]
      || this.$t('orderSummary.couponDiscount.placeholder');
  },
  computed: {
    ...mapWritableState(useCartStore, ['discountCode', 'discountApplied',
      'discountErrorMessage']),
    GiftIcon() {
      return `${getStaticUrl(GiftIcon)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addDiscountCode', 'removeDiscountCode']),
    ...mapActions(useConfigStore, ['getStoreConfig']),

    async dispatchDiscountCode(discountCode) {
      this.loadingDiscountCode = true;
      await this.addDiscountCode(discountCode);
      this.loadingDiscountCode = false;
    },
    openDropDown() {
      this.isDropDownVisible = !this.isDropDownVisible;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
@import '../../../../styles/core/_dropdown.scss';
</style>
