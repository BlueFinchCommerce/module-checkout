<template>
  <div class="shipping-step">
    <SavedDeliveryAddress />
    <div class="shipping-form">
      <ShippingMethod />
    </div>
  </div>
</template>
<script>
// stores
import { mapActions, mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';

// components
import SavedDeliveryAddress
  from '@/components/Steps/CustomerInfoPage/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import ShippingMethod from '@/components/Steps/ShippingPage/ShippingMethod/ShippingMethod.vue';

export default {
  name: 'ShippingPage',
  components: {
    SavedDeliveryAddress,
    ShippingMethod,
  },
  computed: {
    ...mapState(useConfigStore, ['storeCode']),
  },
  async created() {
    await this.getInitialConfig();
    await this.getCart();

    this.setDefaultShippingMethod();

    this.trackStep({
      step: 2,
      description: 'shipping',
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useShippingMethodsStore, ['setDefaultShippingMethod']),
    ...mapActions(useGtmStore, ['trackStep']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
