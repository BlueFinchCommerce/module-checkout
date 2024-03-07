<template>
  <div class="divider">
    <div class="divider-line"></div>
    <TextField :text="$t('dividerText')" />
    <div class="divider-line"></div>
  </div>
</template>
<script>
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'DividerComponent',
  components: {
    TextField,
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
