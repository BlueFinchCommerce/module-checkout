<template>
  <header
    class="header-container"
    :style="style"
  >
    <div class="header-content">
      <a
        :href="secureBaseUrl + storeCode"
        aria-label="logo"
        class="header-logo"
        :class="custom.checkoutLogo ? 'logo-no-width' : ''"
      >
        <Logo alt="logo"/>
      </a>
      <div class="header-title">
        <Lock
          stroke="white"
          class="secure-logo"
        />
        <h1 class="secure-text">
          {{ headerText }}
        </h1>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import Logo from '@/components/Core/Icons/Logo/Logo.vue';
import Lock from '@/components/Core/Icons/Lock/Lock.vue';

export default {
  name: 'AppHeader',
  components: {
    Logo,
    Lock,
  },
  data() {
    return {
      headerText: '',
      headerTextId: 'gene-bettercheckout-header-text',
    };
  },
  async created() {
    await this.getStoreConfig();
    this.headerText = window.geneCheckout?.[this.headerTextId] || this.$t('header.text');
  },
  computed: {
    ...mapState(useConfigStore, ['secureBaseUrl', 'storeCode']),
  },
  methods: {
    ...mapActions(useConfigStore, ['custom', 'getStoreConfig']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
