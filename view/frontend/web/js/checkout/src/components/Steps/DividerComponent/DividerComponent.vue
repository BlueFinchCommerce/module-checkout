<template>
  <div class="divider">
    <div class="divider-line"></div>
    <TextField :text="$t('dividerText')" font-size="18px" font-weight="400"/>
    <div class="divider-line"></div>
  </div>
</template>
<script>
import TextField from '../../Core/TextField/TextField.vue';

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
