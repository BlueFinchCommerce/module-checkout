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
        <!-- dicountApplied replaced with giftCardAppliedOverride only for ui designer -->
        <TextInput
          v-model="giftCardCode"
          :error="giftCardErrorMessage"
          name="gift-code"
          :placeholder="giftCardPlaceholderText"
          :disabled="giftCardAppliedOverride"
          autocomplete="off"
        />
        <!-- dicountApplied replaced with giftCardAppliedOverride only for ui designer -->
        <MyButton
          v-if="!giftCardAppliedOverride"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(giftCardCode)"
        />
        <!-- dicountApplied replaced with giftCardAppliedOverride
          and removed @click="removeGiftCardCode" only for ui designer -->
        <MyButton
          v-if="giftCardAppliedOverride"
          secondary
          :label="removeButtonText"
        />
        <div class="success">
          <!-- dicountApplied replaced with giftCardAppliedOverride and
            discountCode replaced with discountCodeOverride only for ui designer -->
          <SuccessMessage
            v-if="giftCardAppliedOverride"
            :message="$t('orderSummary.giftCardDiscount.successMessage', { code: giftCardCodeOverride })"
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
import useConfigStore from '@/stores/ConfigStore';
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
      isDropDownVisible: false,
      loadingDiscountCode: false,
      applyButtonText: '',
      applyButtonTextId: 'gene-bettercheckout-applybutton-text',
      removeButtonText: '',
      removeButtonTextId: 'gene-bettercheckout-removebutton-text',
      giftCardText: '',
      giftCardTextId: 'gene-bettercheckout-giftcard-text',
      giftCardPlaceholderText: '',
      giftCardPlaceholderTextId: 'gene-bettercheckout-giftcardplaceholder-text',
      giftCardAppliedOverride: true, // Only for UI designer to show with added code
      giftCardCodeOverride: 'TestCode123', // Only for UI designer to show with added code
    };
  },
  async created() {
    await this.getStoreConfig();
    this.applyButtonText = window.geneCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.geneCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.giftCardText = window.geneCheckout?.[this.giftCardTextId] || this.$t('orderSummary.giftDiscountTitle');
    this.giftCardPlaceholderText = window.geneCheckout?.[this.giftCardPlaceholderTextId]
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
    ...mapWritableState(useCartStore, ['giftCardCode', 'giftCardApplied',
      'giftCardErrorMessage']),
    GiftIcon() {
      return `${getStaticUrl(GiftIcon)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addGiftCardCode', 'removeGiftCardCode']),
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setApplyButtonText(event) {
      this.applyButtonText = event?.detail || this.$t('orderSummary.applyBtn');
    },
    setRemoveButtonText(event) {
      this.removeButtonText = event?.detail || this.$t('orderSummary.removeBtn');
    },
    setGiftCardText(event) {
      this.giftCardText = event?.detail || this.$t('orderSummary.giftDiscountTitle');
    },
    setGiftCardPlaceholderText(event) {
      this.giftCardPlaceholderText = event?.detail || this.$t('orderSummary.giftCardDiscount.placeholder');
    },

    async dispatchDiscountCode(giftCardCode) {
      this.loadingDiscountCode = true;
      await this.addGiftCardCode(giftCardCode);
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
