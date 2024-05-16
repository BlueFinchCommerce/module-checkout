<template>
  <div class="delivery-address">
    <div
      class="delivery-address-link"
      aria-label="proceed-to-details-link"
      data-cy="completed-step-details-trigger"
      @click="setDetailsStepActive"
      @keydown="openDropDown"
    >
      <div class="details-title-section">
        <div class="details-title-section-image">
          <YourDetails
            fill="black"
            :data-cy="'completed-step-details-icon'"
          />
        </div>
        <div class="details-title-section-title">
          <TextField
            :text="detailStepText"
            :data-cy="'completed-step-details-title'"
          />
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
          :data-cy="'completed-step-details-edit-button'"
        >
          <TextField
            class="edit-button-title"
            :text="$t('yourDetailsSection.editButton')"
            :data-cy="'completed-step-details-edit-button-text'"
          />
          <Edit :data-cy="'completed-step-details-edit-icon'"/>
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
      detailStepTextId: 'gene-bettercheckout-detailstep-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
  },
  async created() {
    this.detailStepText = window.geneCheckout?.[this.detailStepTextId] || this.$t('yourDetailsSection.title');
    await this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToYouDetails']),

    setDetailsStepActive() {
      if (window.geneCheckout?.overrides?.setDetailsStepActive) {
        window.geneCheckout.overrides.setDetailsStepActive();
      } else {
        const element = document.getElementById('progress-bar');

        if (element) {
          element.classList.add('shipping-active');
        }
        this.goToYouDetails();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
