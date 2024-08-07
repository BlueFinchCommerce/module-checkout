<template v-if="address && address.city">
  <div class="address-block__address">
    <div>
      <p v-if="showNameFields">
        {{ sanitizedAddress.firstname }} {{ sanitizedAddress.lastname }}
      </p>
      <p>
        {{ sanitizedAddress.street[0] }}
      </p>
      <p>
        <template v-if="sanitizedAddress.street[1]">
          {{ sanitizedAddress.street[1] }}
        </template>
      </p>
      <p>
        {{ sanitizedAddress.city }}
      </p>
      <p>
        <template v-if="showRegion">
          {{ sanitizedAddress.region }}
        </template>
      </p>
      <p>
        {{ sanitizedAddress.postcode }}
      </p>
      <p v-if="showNameFields">
        {{ sanitizedAddress.telephone }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressBlock',
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
    address: {
      default: {
        street: ['', ''],
        city: '',
        region: '',
        country_code: '',
        postcode: '',
        company: '',
        telephone: '',
        firstname: '',
        lastname: '',
      },
    },
    showNameFields: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showRegion() {
      const { region } = this.address;
      return region && typeof region === 'string';
    },
    sanitizedAddress() {
      return {
        ...this.address,
        firstname: this.address.firstname === 'UNKNOWN' ? '' : this.address.firstname,
        lastname: this.address.lastname === 'UNKNOWN' ? '' : this.address.lastname,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
