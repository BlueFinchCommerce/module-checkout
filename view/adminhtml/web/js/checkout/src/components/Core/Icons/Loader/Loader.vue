<template>
  <div
    v-if="isLoading"
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
</template>

<script>
import { mapState } from 'pinia';
import useLoadingStore from '@/stores/LoadingStore';

import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import Loader from '@/icons/loader.gif';

export default {
  name: 'Loader',
  computed: {
    ...mapState(useLoadingStore, ['isLoading']),
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
