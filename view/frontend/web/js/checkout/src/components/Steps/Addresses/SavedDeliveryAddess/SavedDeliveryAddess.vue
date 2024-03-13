<template>
  <div class="delivery-address">
    <router-link
      class="delivery-address-link"
      aria-label="proceed-to-details-link"
      to="/"
      @click="setDetailsStepActive();"
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
        :address_type="isItemRequiringDelivery ? `shipping` : `billing`"
        :address="isItemRequiringDelivery ? cart.shipping_addresses?.[0] : cart.billing_address"
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
    </router-link>
  </div>
</template>
<script>
// stores
import { mapState, mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useStepsStore from '@/stores/StepsStore';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import AddressBlockShort from '@/components/Steps/Addresses/AddressBlockShort/AddressBlockShort.vue';

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
    ...mapState(useCartStore, ['cart', 'isItemRequiringDelivery']),
  },
  async created() {
    await this.getStoreConfig();
    this.detailStepText = window.geneCheckout?.[this.detailStepTextId] || this.$t('yourDetailsSection.title');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useStepsStore, ['goToYouDetails']),

    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('details-active');
      this.goToYouDetails();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
