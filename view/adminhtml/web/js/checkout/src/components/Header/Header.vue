<template>
  <header
    class="header-container"
    :style="style"
  >
    <div class="header-content">
      <a
        :href="secureBaseLinkUrl"
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
      headerTextId: 'bluefinch-checkout-header-text',
    };
  },
  async created() {
    await this.getInitialConfig();
    this.headerText = window.bluefinchCheckout?.[this.headerTextId] || this.$t('header.text');

    document.addEventListener(this.headerTextId, this.setHeaderText);
  },
  unmounted() {
    document.removeEventListener(this.headerTextId, this.setHeaderText);
  },
  computed: {
    ...mapState(useConfigStore, ['secureBaseLinkUrl']),
  },
  methods: {
    ...mapActions(useConfigStore, ['custom', 'getInitialConfig']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
