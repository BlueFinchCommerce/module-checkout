<template>
  <img :src="bin" width="24" height="24" alt="remove-icon" />
</template>

<script>
import { computed, reactive } from 'vue';
import getStaticUrl from '@/helpers/getStaticPath';
import binSvg from '@/icons/bin.svg';

export default {
  name: 'Remove',
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
    bin() {
      return `${getStaticUrl(binSvg)}`;
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
