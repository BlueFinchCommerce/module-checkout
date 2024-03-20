<template>
  <div
    ref="googleMap"
    class="google-map-container"
  />
</template>

<script>
// Stores
import { mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default {
  name: 'GoogleMap',
  props: {
    lat: {
      type: Number,
      required: true,
      default: 0,
    },
    lng: {
      type: Number,
      required: true,
      default: 0,
    },
    zoom: {
      type: Number,
      default: 14,
    },
  },
  computed: {
    ...mapState(useConfigStore, ['custom']),
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles";
</style>
