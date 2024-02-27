<template>
  <img
    :src="logo"
    :alt="alt"
    :style="styleObject"
    :role="role"
  >
</template>

<script>
import getStaticUrl from '@/helpers/getStaticPath';
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
  computed: {
    logo() {
      return `${getStaticUrl(logoSvg)}`;
    },
    // Use a computed property for style to ensure reactivity
    styleObject() {
      return {
        width: this.width,
        height: this.height,
        fill: this.fill,
        stroke: this.stroke,
      };
    },
  },
};
</script>
