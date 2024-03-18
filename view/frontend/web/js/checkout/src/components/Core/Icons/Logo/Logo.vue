<template>
  <Loader v-if="!logo"/>
  <img
    v-else
    :src="logo"
    :alt="alt"
    :style="params"
  >
</template>

<script>
import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import { computed, reactive } from 'vue';

import logoSvg from '@/icons/logo.svg';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

export default {
  name: 'Logo',
  components: {
    Loader
  },
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