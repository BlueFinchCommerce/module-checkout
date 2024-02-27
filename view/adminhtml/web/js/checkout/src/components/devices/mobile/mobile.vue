<template>
  <div class="mock-mobile">
    <div class="camera" />
    <div class="display">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MockMobile',
};
</script>
<style lang="scss" scoped>
.mock-mobile {
  border: 10px solid #444;
  border-radius: 40px;
  height: 700px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 375px;

  .camera {
    background: #444;
    border-bottom-left-radius: 17px;
    border-bottom-right-radius: 17px;
    height: 25px;
    left: 50%;
    margin: 0 auto;
    position: sticky;
    top: 0;
    transform: translateX(-50%);
    width: 125px;
    z-index: 10;
  }

  .display {
    container-type: inline-size;
    height: 100%;
    margin-top: -25px;
    overflow: auto;
    width: 100%;
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
