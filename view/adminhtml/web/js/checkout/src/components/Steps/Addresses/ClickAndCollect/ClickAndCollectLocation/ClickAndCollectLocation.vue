<template>
  <div class="click-and-collect-location">
    <div>
      <span class="click-and-collect-title click-and-collect-semibold">{{ location.site_name }} - </span>
      <span class="click-and-collect-title">
        {{
          $t('yourDetailsSection.deliverySection.addressForm.collectionDistance',
             { distance: formattedMiles })
        }}
      </span>
    </div>
    <p>
      {{ formattedAddress }}
    </p>
    <div
      class="click-and-collect-map-title"
      @click="infoOpen = !infoOpen"
      @keydown="infoOpen = !infoOpen"
    >
      <Present />
      {{ $t('yourDetailsSection.deliverySection.addressForm.viewMapAndHours') }}
      <ArrowUp
        v-if="infoOpen"
        height="9"
        stroke="black"
        width="12"
      />
      <ArrowDown
        v-else
        height="9"
        stroke="black"
        width="12"
      />
    </div>
    <div>
      <LinkComponent
        class="click-and-collect-select"
        :label="$t('yourDetailsSection.deliverySection.addressForm.selectLocation')"
        @click.prevent="selectAddress(location)"
      />
    </div>
    <div v-if="infoOpen">
      <TextField
        class="click-and-collect-title click-and-collect-semibold"
        :text="$t('yourDetailsSection.deliverySection.clickandCollectOpeningTimes')"
      />
      <div class="click-and-collect-opening-times">
        <TextField :text="$t('days.monday')" />
        <TextField :text="`${location.monday_open} - ${location.monday_close}`" />
        <TextField :text="$t('days.tuesday')" />
        <TextField :text="`${location.tuesday_open} - ${location.tuesday_close}`" />
        <TextField :text="$t('days.wednesday')" />
        <TextField :text="`${location.wednesday_open} - ${location.wednesday_close}`" />
        <TextField :text="$t('days.thursday')" />
        <TextField :text="`${location.thursday_open} - ${location.thursday_close}`" />
        <TextField :text="$t('days.friday')" />
        <TextField :text="`${location.friday_open} - ${location.friday_close}`" />
        <TextField :text="$t('days.saturday')" />
        <TextField :text="`${location.saturday_open} - ${location.saturday_close}`" />
        <TextField :text="$t('days.sunday')" />
        <TextField :text="`${location.sunday_open} - ${location.sunday_close}`" />
      </div>
    </div>
  </div>
</template>

<script>
// Components
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import Present from '@/components/Core/Icons/Present/Present.vue';
import LinkComponent from '@/components/Core/Link/Link.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

// Helpers
import formatClickAndCollectAddress from '@/helpers/formatClickAndCollectAddress';

// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

export default {
  name: 'ClickAndCollectLocation',
  components: {
    ArrowDown,
    ArrowUp,
    Present,
    LinkComponent,
    TextField,
  },
  props: {
    location: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      infoOpen: false,
    };
  },
  computed: {
    ...mapState(useConfigStore, ['countryCode']),
    formattedMiles() {
      return this.location.miles.toFixed(2);
    },
    formattedLat() {
      return parseFloat(this.location.lat);
    },
    formattedLng() {
      return parseFloat(this.location.long);
    },
    formattedAddress() {
      return formatClickAndCollectAddress(this.location);
    },
  },
  methods: {
    ...mapActions(useCustomerStore, ['setAddress']),
    ...mapActions(useShippingMethodsStore, ['setAsClickAndCollect', 'setClickAndCollectLocation']),
    async selectAddress(location) {
      await this.setAsClickAndCollect(location.site_number);
      const newAddress = {
        id: 'clickAndCollect',
        company: location.siteName,
        street: [location.address],
        city: location.city,
        country_id: this.countryCode,
        region: location.county,
        region_id: 0,
        postcode: location.postcode,
      };
      this.setAddress(newAddress, 'shipping');
      this.setClickAndCollectLocation(location);
    },
  },
};
</script>

<style lang="scss" scoped>
@import ".././styles.scss";
</style>
