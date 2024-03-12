<template v-if="address && address.city">
  <div class="address-block__address">
    <div>
      <p v-if="showNameFields">{{ address.firstname }} {{ address.lastname }}</p>
      <p>{{ address.street[0] }}</p>
      <p>
        <template v-if="address.street[1]">
          {{ address.street[1] }}
        </template>
      </p>
      <p>{{ address.city }}</p>
      <p>
        <template v-if="showRegion">
          {{ address.region }}
        </template>
      </p>
      <p>{{ address.postcode }}</p>
      <p v-if="showNameFields"> {{ address.telephone }}</p>
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
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
