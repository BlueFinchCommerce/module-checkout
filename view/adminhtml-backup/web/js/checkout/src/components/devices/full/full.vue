<template>
  <div class="mock-full">
    <div class="display">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MockFull',
};
</script>
<style lang="scss" scoped>
.mock-full {
  height: 100%;

  .display {
    height: 100%;
    overflow: auto;
    width: 100%;
  }
}
</style>
