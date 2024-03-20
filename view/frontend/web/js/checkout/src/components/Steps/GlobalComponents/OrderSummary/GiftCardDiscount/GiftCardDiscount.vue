<template>
  <div v-if="loadingDiscountCode">
    <Loader />
  </div>
  <div
    class="gift-discount-trigger dropdown-button"
    data-cy="dropdown-trigger-gift"
    tabindex="0"
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
        <TextInput
          v-model="giftCardCode"
          :error="giftCardErrorMessage"
          name="gift-code"
          :placeholder="giftCardPlaceholderText"
          :disabled="cart.applied_gift_cards?.[0]"
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
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

// stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
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
    };
  },
  async created() {
    await this.getStoreConfig();
    this.applyButtonText = window.geneCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.geneCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.giftCardText = window.geneCheckout?.[this.giftCardTextId] || this.$t('orderSummary.giftDiscountTitle');
    this.giftCardPlaceholderText = window.geneCheckout?.[this.giftCardPlaceholderTextId]
      || this.$t('orderSummary.giftCardDiscount.placeholder');
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
    ...mapActions(useConfigStore, ['getStoreConfig']),

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
@import "@/styles/core/_dropdown.scss";
</style>
