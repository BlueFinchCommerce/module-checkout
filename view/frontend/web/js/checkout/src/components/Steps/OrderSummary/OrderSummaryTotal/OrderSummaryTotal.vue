<template>
  <div class="order-total-title">
    <TextField :text="$t('orderSummary.modalHeader')" />
    <TextField
      v-if="cartItemsQty > 0"
      class="order-total-title-amount"
      :text="`(${cartItemsQty})`"
    />
  </div>
  <div class="order-total-container">
    <div class="order-total-wrapper">
      <div
        v-for="(total, index) in totalSegments"
        :key="index"
        class="order-total"
      >
        <div
          v-if="total.code === 'penniesdonation'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-if="total.code === 'shipping'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('progressBar.shippingStepTitle')"
            font-size="16px"
            font-weight="300"
          />
          <Price
            v-if="selectedMethod.method_code"
            :value="shippingPrice"
            font-size="16px"
            font-weight="300"
          />
          <TextField
            v-else
            :text="$t('shippingStep.tbc')"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'discount'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'giftcardaccount'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="total.title"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'reward' && total.value"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.rewardsTitle')"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'customerbalance' && total.value"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.storeCreditTitle')"
          />
          <Price
            :value="total.value"
          />
        </div>
        <div
          v-else-if="total.code === 'subtotal'"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.subtotalTitle')"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'giftwrapping'
            && total.extension_attributes.gw_base_price > 0 "
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.discountTitle')"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.extension_attributes.gw_base_price"
            font-size="16px"
            font-weight="300"
          />
        </div>
        <div
          v-else-if="total.code === 'tax' && taxCartDisplayFullSummary"
          class="total__row"
        >
          <TextField
            class="total__text"
            :text="$t('orderSummary.inclTaxTitle')"
            font-size="16px"
            font-weight="300"
          />
          <Price
            :value="total.value"
            font-size="16px"
            font-weight="300"
          />
        </div>
      </div>
    </div>
    <div class="order-total-grand">
      <TextField :text="$t('orderSummary.grandTotalTitle')" />
      <Price :value="cartGrandTotal / 100" />
    </div>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/TextField/TextField.vue';
import Price from '@/components/Core/Price/Price.vue';

// stores
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

export default {
  name: 'OrderSummaryTotal',
  components: {
    Price,
    TextField,
  },
  computed: {
    ...mapState(useCartStore, ['cartGrandTotal', 'totalSegments', 'shippingPrice', 'cartItemsQty']),
    ...mapState(useConfigStore, ['taxCartDisplayFullSummary']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
