<template>
  <div
    class="gift-discount-trigger dropdown-button"
    data-cy="dropdown-trigger-gift"
    tabindex="0"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="gift-discount-icon-container">
      <img
        :src="GiftIcon"
        alt="gift-dropdown-icon"
      >
    </div>
    <TextField
      :text="giftCardText"
      class="gift-discount-title"
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
    class="gift-dropdown"
    :class="{active: isDropDownVisible}"
  >
    <template #content>
      <div class="field gift-code-field">
        <TextInput
          :error="giftCardErrorMessage"
          name="gift-code"
          :placeholder="giftCardPlaceholderText"
          autocomplete="off"
        />
        <MyButton
          v-if="!cart.applied_gift_cards?.[0]"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(giftCardCode)"
        />

        <MyButton
          v-if="cart.applied_gift_cards?.[0]"
          secondary
          :label="removeButtonText"
          @click="removeGiftCardCode(giftCardCode)"
        />
        <div class="success">
          <SuccessMessage
            v-if="cart.applied_gift_cards?.[0]"
            :message="$t('orderSummary.giftCardDiscount.successMessage', { code: giftCardCode })"
          />
        </div>
        <div class="error">
          <ErrorMessage
            v-if="giftCardErrorMessage"
            :message="$t('orderSummary.giftCardDiscount.errorMessage')"
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

// stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useLoadingStore from '@/stores/LoadingStore';

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
    SuccessMessage,
  },
  data() {
    return {
      isDropDownVisible: false,
      applyButtonText: '',
      applyButtonTextId: 'bluefinch-checkout-applybutton-text',
      removeButtonText: '',
      removeButtonTextId: 'bluefinch-checkout-removebutton-text',
      giftCardText: '',
      giftCardTextId: 'bluefinch-checkout-giftcard-text',
      giftCardPlaceholderText: '',
      giftCardPlaceholderTextId: 'bluefinch-checkout-giftcardplaceholder-text',
    };
  },
  async created() {
    await this.getInitialConfig();
    this.applyButtonText = window.bluefinchCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.bluefinchCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.giftCardText = window.bluefinchCheckout?.[this.giftCardTextId] || this.$t('orderSummary.giftDiscountTitle');
    this.giftCardPlaceholderText = window.bluefinchCheckout?.[this.giftCardPlaceholderTextId]
      || this.$t('orderSummary.giftCardDiscount.placeholder');

    document.addEventListener(this.applyButtonTextId, this.setApplyButtonText);
    document.addEventListener(this.removeButtonTextId, this.setRemoveButtonText);
    document.addEventListener(this.giftCardTextId, this.setGiftCardText);
    document.addEventListener(this.giftCardPlaceholderTextId, this.setGiftCardPlaceholderText);
  },
  unmounted() {
    document.removeEventListener(this.applyButtonTextId, this.setApplyButtonText);
    document.removeEventListener(this.removeButtonTextId, this.setRemoveButtonText);
    document.removeEventListener(this.giftCardTextId, this.setGiftCardText);
    document.removeEventListener(this.giftCardPlaceholderTextId, this.setGiftCardPlaceholderText);
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'giftCardErrorMessage']),
    ...mapWritableState(useCartStore, ['giftCardCode']),
    GiftIcon() {
      return `${getStaticUrl(GiftIcon)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addGiftCardCode', 'removeGiftCardCode']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useLoadingStore, ['setLoadingState']),

    setApplyButtonText(event) {
      this.applyButtonText = event?.detail?.value || this.$t('orderSummary.applyBtn');
    },
    setRemoveButtonText(event) {
      this.removeButtonText = event?.detail?.value || this.$t('orderSummary.removeBtn');
    },
    setGiftCardText(event) {
      this.giftCardText = event?.detail?.value || this.$t('orderSummary.giftDiscountTitle');
    },
    setGiftCardPlaceholderText(event) {
      this.giftCardPlaceholderText = event?.detail?.value || this.$t('orderSummary.giftCardDiscount.placeholder');
    },

    async dispatchDiscountCode() {
      // this.setLoadingState(true);
      // await this.addGiftCardCode(giftCardCode);
      // this.setLoadingState(false);
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
