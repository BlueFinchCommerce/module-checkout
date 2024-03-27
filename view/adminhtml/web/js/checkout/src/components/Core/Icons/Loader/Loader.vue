<template>
  <div
    v-if="overlay"
    class="loading-mask"
    @click="captureClick"
    @keydown="captureClick"
  >
    <div class="loader">
      <img
        :style="style"
        :src="Loader"
        alt="loader"
        width="50px"
        height="50px"
      >
    </div>
  </div>
  <template v-if="!overlay">
    <div class="loader">
      <img
        :style="style"
        :src="Loader"
        alt="loader"
      >
    </div>
  </template>
</template>

<script>
import { computed, reactive } from 'vue';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import Loader from '@/icons/loader.gif';

export default {
  name: 'Loader',
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
      })),
    };
  },
  computed: {
    Loader() {
      return `${getStaticUrl(Loader)}`;
    },
  },
  methods: {

    captureClick(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    },
  },
};
</script>

<style lang="scss">
  @import "@/styles/core/_loader";
</style>
