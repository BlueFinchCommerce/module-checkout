<template>
  <span :class="logo ? '' : 'text-loading'">
      <img
        :src="logo"
        :alt="alt"
        :style="params"
      >
  </span>
</template>

<script>
import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import { computed, reactive } from 'vue';
import logoSvg from '@/icons/logo.svg';

export default {
  name: 'Logo',
  props: {
    params: {
      type: String,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    fill: {
      type: String,
    },
    stroke: {
      type: String,
    },
    role: {
      type: String,
    },
    alt: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
        fill: reactiveProps.fill,
        stroke: reactiveProps.stroke,
      })),
    };
  },
  data() {
    return {
      logo: '',
    };
  },
  async created() {
    await this.getStoreConfig();
    this.logo = window.geneCheckout?.logo || getStaticUrl(logoSvg);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
