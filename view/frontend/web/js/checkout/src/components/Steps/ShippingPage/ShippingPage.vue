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
import useConfigStore from '@/stores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useGtmStore from '@/stores/GtmStore';

// components
import SavedDeliveryAddress
  from '@/components/Steps/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
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
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCartData();
      await this.getCart();
    }
    this.$nextTick(this.setDefaultShippingMethod);

    this.trackStep({
      step: 2,
      description: 'shipping',
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart', 'getCartData']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useShippingMethodsStore, ['setDefaultShippingMethod']),
    ...mapActions(useGtmStore, ['trackStep']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
