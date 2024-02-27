<template>
  <header
    class="header-container"
    :style="style"
  >
    <div class="header-content">
      <a
        :href="secureBaseUrl"
        aria-label="logo"
        class="header-logo"
        :class="custom.checkoutLogo ? 'logo-no-width' : ''"
        alt="Header Logo"
      >
        <Logo alt="logo" />
      </a>
      <div class="header-title">
        <Lock
          stroke="white"
          class="secure-logo"
        />
        <TextField
          class="secure-text"
          :text="$t('header.text')"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { computed, reactive } from 'vue';
import { mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStore';

// components
import Lock from '@/components/Core/Icons/Lock/Lock.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import Logo from '@/components/Core/Logo/Logo.vue';

export default {
  name: 'AppHeader',
  components: {
    Logo,
    Lock,
    TextField,
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        background: reactiveProps.background,
      })),
    };
  },
  computed: {
    ...mapState(useConfigStore, ['custom', 'secureBaseUrl']),
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
