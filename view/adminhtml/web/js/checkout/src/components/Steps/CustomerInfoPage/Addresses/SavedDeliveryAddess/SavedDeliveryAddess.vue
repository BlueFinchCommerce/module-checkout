<template>
  <div class="delivery-address">
    <div
      class="delivery-address-link"
      aria-label="proceed-to-details-link"
    >
      <div class="details-title-section">
        <div class="details-title-section-image">
          <YourDetails fill="black" />
        </div>
        <div class="details-title-section-title">
          <TextField :text="detailStepText" />
        </div>
      </div>
      <AddressBlockShort
        class="shipping-billing-steps"
        :address_type="!cart.is_virtual ? `shipping` : `billing`"
        :address="!cart.is_virtual ? cart.shipping_addresses?.[0] : cart.billing_address"
      />
      <div class="address-block__edit proceed-to-details">
        <button
          class="button--blank edit-details-button"
          :aria-label="$t('yourDetailsSection.editDetailsButtonLabel')"
        >
          <TextField
            class="edit-button-title"
            :text="$t('yourDetailsSection.editButton')"
          />
          <Edit />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
// stores
import { mapState, mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useStepsStore from '@/stores/StepsStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import AddressBlockShort from '@/components/Steps/CustomerInfoPage/Addresses/AddressBlockShort/AddressBlockShort.vue';

// icons
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import YourDetails from '@/components/Core/Icons/YourDetails/YourDetails.vue';

export default {
  name: 'SavedDeliveryAddress',
  components: {
    TextField,
    AddressBlockShort,
    YourDetails,
    Edit,
  },
  data() {
    return {
      detailStepText: '',
      detailStepTextId: 'bluefinch-checkout-detailstep-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
  },
  async created() {
    this.detailStepText = window.bluefinchCheckout?.[this.detailStepTextId] || this.$t('yourDetailsSection.title');

    document.addEventListener(this.detailStepTextId, this.setDetailStepText);
  },
  unmounted() {
    document.removeEventListener(this.detailStepTextId, this.setDetailStepText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToYouDetails']),
    setDetailStepText(event) {
      this.detailStepText = event?.detail?.value || this.$t('yourDetailsSection.title');
    },
    setDetailsStepActive() {
      // Commented out to prevent functionality only for UI designer
      // const element = document.getElementById('progress-bar');
      // element.classList.add('details-active');
      // this.goToYouDetails();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
