<template>
  <Loqate
    v-if="addressFinder.loqate.enabled && addressFinder.loqate.apiKey && !addressFinder.afd.enabled"
    :address_type="addressType"
  />
  <AfdPostCode
    v-if="addressFinder.afd.enabled && !addressFinder.loqate.enabled"
    :address_type="addressType"
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
    addressType: {
      type: String,
      default: 'shipping',
    },
  },
  computed: {
    ...mapState(useConfigStore, ['addressFinder']),
  },
  methods: {
    ...mapActions(useConfigStore, ['getLoqateConfiguration', 'getAfdStatus']),
  },
};
</script>
