<template>
  <div class="product-options" v-if="product.options && product.options.length">
      <div class="product-options-trigger"
           data-cy="product-options-trigger"
              @click="showProductOptions" @keydown="showProductOptions">
          <TextField :text="$t('productOptionsTrigger')"/>
          <ArrowUp stroke="black" v-if="productOptionsVisible"/>
          <ArrowDown stroke="black" v-if="!productOptionsVisible"/>
      </div>
      <div class="product-option" v-if="productOptionsVisible">
          <div class="option-value"
              v-for="(option, index) in product.options" :key="index">
          <TextField :text="option.value.replaceAll('&lt;', '<').replaceAll('&gt;', '>')"/>
          </div>
      </div>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/TextField/TextField.vue';

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
    product: {
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
