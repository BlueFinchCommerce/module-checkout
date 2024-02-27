<template>
  <AppHeader />
  <Steps />
  <AppFooter />
</template>
<script>
import useConfigStore from '@/stores/ConfigStore';
import { mapActions } from 'pinia';

import AppHeader from '@/components/Header/Header.vue';
import AppFooter from '@/components/Footer/Footer.vue';
import Steps from '@/components/Steps/Steps.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    Steps,
  },
  async created() {
    await this.getStoreConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
  },
};
</script>
<style lang="scss">
@import "@/styles/_core.scss";
@import "@/styles/global/variables";
</style>
