<template>
  <div v-if="loadingDiscountCode">
    <Loader />
  </div>
  <div
    class="gift-discount-trigger dropdown-button"
    data-cy="dropdown-trigger-gift"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDown"
  >
    <div class="gift-discount-icon-container">
      <img
        :src="GiftIcon"
        alt="gift-dropdown-icon"
      >
    </div>
    <TextField
      :text="$t('orderSummary.giftDiscountTitle')"
      class="gift-discount-title"
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
    class="gift-dropdown"
    :class="{active: isDropDownVisible}"
  >
    <template #content>
      <div class="field coupon-code-field">
        <TextInput
          v-model="discountCode"
          :error="giftCardErrorMessage"
          name="coupon-code"
          :placeholder="$t('orderSummary.giftCardDiscount.placeholder')"
          :disabled="discountApplied"
          autocomplete="off"
        />
        <MyButton
          v-if="!discountApplied"
          primary
          :label="$t('orderSummary.applyBtn')"
          @click="dispatchDiscountCode(discountCode)"
        />

        <MyButton
          v-if="discountApplied"
          secondary
          :label="$t('orderSummary.removeBtn')"
          @click="removeGiftCardCode"
        />
        <div class="success">
          <SuccessMessage
            v-if="discountApplied"
            :message="$t('orderSummary.giftCardDiscount.successMessage', { code: discountCode })"
          />
        </div>
        <div class="error">
          <ErrorMessage
            v-if="giftCardErrorMessage"
            :message="giftCardErrorMessage"
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
import GiftIcon from '@/icons/gift-icon.svg';

export default {
  name: 'GiftCardDiscount',
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
    };
  },
  computed: {
    ...mapWritableState(useCartStore, ['discountCode', 'discountApplied',
      'giftCardErrorMessage']),
    GiftIcon() {
      return `${getStaticUrl(GiftIcon)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addGiftCardCode', 'removeGiftCardCode']),

    async dispatchDiscountCode(discountCode) {
      this.loadingDiscountCode = true;
      await this.addGiftCardCode(discountCode);
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
