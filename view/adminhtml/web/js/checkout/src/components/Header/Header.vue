<template>
  <header
    class="header-container"
    :style="style"
  >
    <div class="header-content">
      <Logo alt="logo" />
      <div class="header-title">
        <Lock
          stroke="white"
          class="secure-logo"
        />
        <TextField
          class="secure-text"
          :text="headerText"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';
import Logo from '@/components/Core/Logo/Logo.vue';
import Lock from '@/components/Core/Icons/Lock/Lock.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'AppHeader',
  components: {
    Logo,
    Lock,
    TextField,
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

    document.addEventListener(this.headerTextId, this.setHeaderText);
  },
  unmounted() {
    document.removeEventListener(this.headerTextId, this.setHeaderText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setHeaderText(event) {
      this.headerText = event?.detail || this.$t('header.text');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
