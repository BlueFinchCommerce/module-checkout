<template>
  <div class="mock-laptop">
    <div class="display">
      <slot />
    </div>
  </div>
  <div class="footer" />
</template>
<script>
export default {
  name: 'MockLaptop',
};
</script>
<style lang="scss" scoped>
.mock-laptop {
  border: 10px solid #444;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 768px;

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
  height: 25px;
  margin: 0 auto;
  position: relative;
  width: 840px;

  &:after {
    background-color: #444;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    content: '';
    height: 10px;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    width: 100px;
  }
}
</style>
