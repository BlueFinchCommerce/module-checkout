<template>
  <div class="mock-tablet">
    <div class="display">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MockTablet',
};
</script>
<style lang="scss" scoped>
.mock-tablet {
  border-radius: 15px;
  border: 15px solid #444;
  height: 768px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 576px;

  .display {
    container-type: inline-size;
    height: 133.333%;
    overflow: auto;
    transform: scale(75%) translateX(-16.666%) translateY(-16.666%);
    width: 133.333%;
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
