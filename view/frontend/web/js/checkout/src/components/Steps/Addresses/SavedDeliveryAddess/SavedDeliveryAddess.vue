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
          <TextField :text="$t('yourDetailsSection.title')" />
        </div>
      </div>
      <AddressBlockShort
        class="shipping-billing-steps"
        :address_type="isItemRequiringDelivery ? `shipping` : `billing`"
        :address="isItemRequiringDelivery ? selected.shipping : selected.billing"
      />
      <div class="address-block__edit proceed-to-details">
        <button class="button--blank edit-details-button"
                :aria-label="$t('yourDetailsSection.editDetailsButtonLabel')">
          <TextField class="edit-button-title" :text="$t('yourDetailsSection.editButton')" />
          <Edit />
        </button>
      </div>
    </router-link>
  </div>
</template>
<script>
// stores
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
// eslint-disable-next-line max-len
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
  computed: {
    ...mapState(useCartStore, ['isItemRequiringDelivery']),
    ...mapState(useCustomerStore, ['selected']),
  },
  methods: {
    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('details-active');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
