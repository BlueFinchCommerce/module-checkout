<template v-if="address && address.city">
  <div class="address-block__address">
    <div>
      <p v-if="showNameFields"
        :data-cy="dataCy ? `${address_type}-${dataCy}-name-field` : `${address_type}-name-field`"
      >
        {{ address.firstname }} {{ address.lastname }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-address-one-field` : `${address_type}-address-one-field`">
        {{ address.street[0] }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-address-two-field` :  `${address_type}-address-two-field`">
        <template v-if="address.street[1]">
          {{ address.street[1] }}
        </template>
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-city-field` : `${address_type}-city-field`">
        {{ address.city }}
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-region-field` : `${address_type}-region-field`">
        <template v-if="showRegion">
          {{ address.region }}
        </template>
      </p>
      <p :data-cy="dataCy ? `${address_type}-${dataCy}-postcode-field` : `${address_type}-postcode-field`">
        {{ address.postcode }}
      </p>
      <p v-if="showNameFields"
        :data-cy="dataCy ? `${address_type}-${dataCy}-telephone-field` : `${address_type}-telephone-field`"
      >
        {{ address.telephone }}
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
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
