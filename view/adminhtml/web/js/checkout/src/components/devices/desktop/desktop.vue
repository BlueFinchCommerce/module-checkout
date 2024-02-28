<template>
  <div class="mock-desktop">
    <div class="display">
      <slot />
    </div>
  </div>
  <div class="footer" />
  <div class="stand" />
</template>
<script>
export default {
  name: 'MockDesktop',
};
</script>
<style lang="scss">
.mock-desktop {
  border: 20px solid #444;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 600px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 960px;

  .display {
    container-type: inline-size;
    height: 200%;
    overflow: auto;
    transform: scale(50%) translateX(-50%) translateY(-50%);
    width: 200%;
  }
}

.footer {
  background-color: #666;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  height: 50px;
  margin: 0 auto;
  position: relative;
  width: 960px;
}

.stand {
  background-color: #444;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 130px;
  margin: 0 auto;
  width: 200px;
}
</style>
