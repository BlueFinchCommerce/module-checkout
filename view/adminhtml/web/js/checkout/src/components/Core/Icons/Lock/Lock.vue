<template>
  <img :src="lockIconSvg" :alt="lockIconSvg" />
</template>

<script>
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import { computed, reactive } from 'vue';
import lockIconSvg from '@/icons/lockIcon.svg';

export default {
  name: 'Lock',
  props: {
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
    ariaLabel: {
      type: String,
    },
  },
  computed: {
    lockIconSvg() {
      return `${getStaticUrl(lockIconSvg)}`;
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
};
</script>
