<template>
  <Loqate
    v-if="addressFinder.loqate.enabled && addressFinder.loqate.apiKey && !addressFinder.afd.enabled"
    :data-cy="dataCy ? `${dataCy}-loqate` : 'loquate'"
    :address_type="address_type"
  />
  <AfdPostCode
    v-if="addressFinder.afd.enabled && !addressFinder.loqate.enabled"
    :data-cy="dataCy ? `${dataCy}-afd-postcode` : 'afd-postcode'"
    :address_type="address_type"
  />
</template>
<script>
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import Loqate from '@/components/Steps/CustomerInfoPage/AddressFinder/Loqate/Loqate.vue';
import AfdPostCode from '@/components/Steps/CustomerInfoPage/AddressFinder/AfdPostCode/AfdPostCode.vue';

export default {
  name: 'AddressFinder',
  components: {
    AfdPostCode,
    Loqate,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
    dataCy: {
      type: String,
    },
  },
  computed: {
    ...mapState(useConfigStore, ['addressFinder']),
  },
  async created() {
    await this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
