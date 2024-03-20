<template>
  <div class="dropdown">
    <slot name="content">
      default content
    </slot>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
};
</script>
<style lang="scss">
@import '../../../styles/core/_dropdown.scss';
</style>
