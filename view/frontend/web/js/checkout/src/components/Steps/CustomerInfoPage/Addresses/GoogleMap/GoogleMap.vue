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

import { Loader } from '@googlemaps/js-api-loader';

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
    ...mapState(useConfigStore, ['googleMapEnabled', 'googleMapApiKey']),
  },
  async created() {
    if (this.googleMapEnabled && this.googleMapApiKey !== '') {
      const loader = new Loader({
        apiKey: this.googleMapApiKey,
      });

      const position = {
        lat: this.lat,
        lng: this.lng,
      };

      const mapOptions = {
        center: position,
        zoom: this.zoom,
        disableDefaultUI: true,
      };

      const google = await loader.load();
      const map = new google.maps.Map(this.$refs.googleMap, mapOptions);
      // eslint-disable-next-line no-new
      new google.maps.Marker({
        position,
        map,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles";
</style>
