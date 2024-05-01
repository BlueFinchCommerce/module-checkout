<template v-if="address && address.city">
  <div class="address-block__address">
    <div>
      <p :data-cy="`completed-step-${address_type}-content`">
        {{ address.firstname }} {{ address.lastname }}, {{ address.street[0] }}
        <template v-if="address.street[1]">
          {{ address.street[1] }}
        </template>
        {{ address.city }}
        <template v-if="showRegion">
          {{ address.region }}
        </template>
        {{ address.postcode }}
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
