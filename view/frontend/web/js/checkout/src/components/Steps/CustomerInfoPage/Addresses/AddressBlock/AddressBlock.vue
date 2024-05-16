<template v-if="address && address.city">
  <div class="address-block__address">
    <div>
      <p v-if="showNameFields"
        :data-cy="dataCy ? `${address_type}-${dataCy}-name-field` : `${address_type}-name-field`"
      >
        {{ sanitizedAddress.firstname }} {{ sanitizedAddress.lastname }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-address-one-field` : `${address_type}-address-one-field`">
        {{ sanitizedAddress.street[0] }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-address-two-field` :  `${address_type}-address-two-field`">
        <template v-if="sanitizedAddress.street[1]">
          {{ sanitizedAddress.street[1] }}
        </template>
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-city-field` : `${address_type}-city-field`">
        {{ sanitizedAddress.city }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-region-field` : `${address_type}-region-field`">
        <template v-if="showRegion">
          {{ sanitizedAddress.region }}
        </template>
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-postcode-field` : `${address_type}-postcode-field`">
        {{ sanitizedAddress.postcode }}
      </p>
      <p v-if="showNameFields"
        :data-cy="dataCy ? `${address_type}-${dataCy}-telephone-field` : `${address_type}-telephone-field`"
      >
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
    dataCy: {
      type: String,
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
