<template>
  <div class="divider">
    <div class="divider-line"></div>
    <TextField :text="dividerText" />
    <div class="divider-line"></div>
  </div>
</template>
<script>
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'DividerComponent',
  components: {
    TextField,
  },
  data() {
    return {
      dividerText: '',
      dividerTextId: 'gene-bettercheckout-divider-text',
    };
  },
  mounted() {
    this.dividerText = window.geneCheckout?.[this.dividerTextId] || this.$t('dividerText');
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
