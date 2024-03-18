<template>
  <div
    v-if="item.configurable_options && item.configurable_options.length"
    class="product-options"
  >
    <div
      class="product-options-trigger"
      data-cy="product-options-trigger"
      @click="showProductOptions"
      @keydown="showProductOptions"
    >
      <TextField :text="$t('productOptionsTrigger')" />
      <ArrowUp v-if="productOptionsVisible" />
      <ArrowDown v-if="!productOptionsVisible" />
    </div>
    <div
      v-if="productOptionsVisible"
      class="product-option"
    >
      <div
        v-for="(option, index) in item.configurable_options"
        :key="index"
        class="option-value"
      >
        <TextField :text="`${option.option_label}: ${option.value_label}`" />
      </div>
    </div>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// icons
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';

export default {
  name: 'ProductOptions',
  components: {
    TextField,
    ArrowUp,
    ArrowDown,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      productOptionsVisible: false,
    };
  },
  methods: {
    showProductOptions() {
      this.productOptionsVisible = !this.productOptionsVisible;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
