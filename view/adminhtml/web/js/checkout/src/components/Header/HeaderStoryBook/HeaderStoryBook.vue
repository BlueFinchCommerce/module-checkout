<template>
  <em>This component is for demonstration purposes only.</em>
  <br><br>
  <header
    class="header-container story-book"
    :style="style"
  >
    <div class="header-content">
      <span aria-label="logo"
        class="header-logo">
        <img
          width="100px"
          :src="LogoIcon"
          alt="logo"/>
      </span>
      <div class="header-title">
        <img
          :src="LockIcon"
          alt="lock-icons"/>
        <h1 class="secure-text">
          {{ headerText }}
        </h1>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, reactive } from 'vue';

// Icons
import LogoSvg from '../../../icons/logo.svg';
import LockSvg from '../../../icons/lockIcon.svg';

export default {
  name: 'HeaderStoryBook',
  props: {
    backgroundColor: {
      type: String,
    },
    color: {
      type: String,
    },
    headerText: {
      type: String,
    },
  },
  computed: {
    LogoIcon() {
      return LogoSvg;
    },
    LockIcon() {
      return LockSvg;
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
        color: reactiveProps.color,
      })),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";
</style>
