<template>
  <div
    v-if="(item.configurable_options && item.configurable_options.length)
    || (item.customizable_options && item.customizable_options.length)"
    class="product-options"
  >
    <div
      class="product-options-trigger"
      @click="showProductOptions"
      @keydown="showProductOptions"
      :data-cy="dataCy ? `${dataCy}-trigger` : 'product-options-trigger'"
    >
      <TextField
        :text="$t('Product options')"
        :data-cy="dataCy ? `${dataCy}-title` : 'product-options-title'"
      />
      <ArrowUp v-if="productOptionsVisible"
        :data-cy="dataCy ? `${dataCy}-up-arrow` : 'product-options-up-arrow'"
      />
      <ArrowDown v-if="!productOptionsVisible"
        :data-cy="dataCy ? `${dataCy}-down-arrow` : 'product-options-down-arrow'"
      />
    </div>
    <div
      v-if="productOptionsVisible && item.configurable_options"
      class="product-option"
    >
      <div
        v-for="(option, index) in item.configurable_options"
        :key="index"
        class="option-value"
      >
        <TextField
          :text="`${option.option_label}: ${option.value_label}`"
          :data-cy="dataCy ? `${dataCy}-option` : 'product-options-option'"
        />
      </div>
    </div>
    <div
      v-if="productOptionsVisible && item.customizable_options"
      class="product-option"
    >
      <div
        v-for="(option, index) in item.customizable_options"
        :key="index"
        class="option-value"
      >
        <TextField
          :text="`${option.label}`"
          :data-cy="dataCy ? `${dataCy}-option` : 'product-options-option'"
        />
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
    dataCy: {
      type: String,
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
