<template>
  <div
    class="gift-discount-trigger dropdown-button"
    tabindex="0"
    :data-cy="dataCy ? `gift-card-trigger-${dataCy}` : 'gift-card-trigger'"
    :class="{opened: isDropDownVisible}"
    @click="openDropDown"
    @keydown="openDropDownKeyDown($event)"
  >
    <div class="gift-discount-icon-container">
      <GiftCardIcon :data-cy="dataCy"/>
    </div>
    <TextField
      :text="giftCardText"
      class="gift-discount-title"
      :data-cy="dataCy ? `gift-card-title-${dataCy}` : 'gift-card-title'"
    />
    <ArrowDown
      v-show="!isDropDownVisible"
      class="dropdown-arrow__down"
      :data-cy="dataCy ? `gift-card-arrow-down-${dataCy}` : 'gift-card-arrow-down'"
    />
    <ArrowUp
      v-show="isDropDownVisible"
      class="dropdown-arrow__up"
      :data-cy="dataCy ? `gift-card-arrow-up-${dataCy}` : 'gift-card-arrow-up'"
    />
  </div>
  <DropDown
    v-show="isDropDownVisible"
    class="gift-dropdown"
    :class="{active: isDropDownVisible}"
    :data-cy="dataCy ? `gift-card-dropdown-${dataCy}` : 'gift-card-dropdown'"
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
          :data-cy="dataCy ? `gift-card-input-${dataCy}` : 'gift-card-input'"
        />
        <MyButton
          v-if="!cart.applied_gift_cards?.[0]"
          primary
          :label="applyButtonText"
          @click="dispatchDiscountCode(giftCardCode)"
          :data-cy="dataCy ? `gift-card-apply-${dataCy}` : 'gift-card-apply'"
        />

        <MyButton
          v-if="cart.applied_gift_cards?.[0]"
          secondary
          :label="removeButtonText"
          @click="removeGiftCardCode(giftCardCode)"
          :data-cy="dataCy ? `gift-card-remove-${dataCy}` : 'gift-card-remove'"
        />
        <div class="success">
          <SuccessMessage
            :data-cy="dataCy ? `gift-card-success-${dataCy}` : 'gift-card-success'"
            v-if="cart.applied_gift_cards?.[0]"
            :message="$t('orderSummary.giftCardDiscount.successMessage', { code: giftCardCode })"
          />
        </div>
        <div class="error">
          <ErrorMessage
            :data-cy="dataCy ? `gift-card-error-${dataCy}` : 'gift-card-error'"
            v-if="giftCardErrorMessage"
            :message="$t('orderSummary.giftCardDiscount.errorMessage')"
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
import GiftCardIcon from '@/components/Core/Icons/GiftCardIcon/GiftCardIcon.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import SuccessMessage from '@/components/Core/ContentComponents/Messages/SuccessMessage/SuccessMessage.vue';

// stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useLoadingStore from '@/stores/LoadingStore';

export default {
  name: 'GiftCardDiscount',
  components: {
    DropDown,
    TextField,
    ArrowDown,
    ArrowUp,
    GiftCardIcon,
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
    this.applyButtonText = window.geneCheckout?.[this.applyButtonTextId] || this.$t('orderSummary.applyBtn');
    this.removeButtonText = window.geneCheckout?.[this.removeButtonTextId] || this.$t('orderSummary.removeBtn');
    this.giftCardText = window.geneCheckout?.[this.giftCardTextId] || this.$t('orderSummary.giftDiscountTitle');
    this.giftCardPlaceholderText = window.geneCheckout?.[this.giftCardPlaceholderTextId]
      || this.$t('orderSummary.giftCardDiscount.placeholder');

    await this.getInitialConfig();
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'giftCardErrorMessage']),
    ...mapWritableState(useCartStore, ['giftCardCode']),
  },
  methods: {
    ...mapActions(useCartStore, ['addGiftCardCode', 'removeGiftCardCode']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useLoadingStore, ['setLoadingState']),

    async dispatchDiscountCode(giftCardCode) {
      this.setLoadingState(true);
      await this.addGiftCardCode(giftCardCode);
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
