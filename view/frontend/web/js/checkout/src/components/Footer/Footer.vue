<template>
  <footer
    class="footer-container"
    :style="style"
  >
    <div class="footer-block">
      <FooterIcons />
      <TextField
        :data-cy="'copyright-text'"
        :text="copyrightText"
      />
    </div>
  </footer>
</template>

<script>
import { reactive, computed } from 'vue';
import { mapState } from 'pinia';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import FooterIcons from '@/components/Footer/FooterIcons/FooterIcons.vue';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default {
  name: 'AppFooter',
  components: {
    TextField,
    FooterIcons,
  },
  props: {
    backgroundColor: {
      type: String,
    },
  },
  computed: {
    ...mapState(useConfigStore, ['copyrightText']),
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
      })),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Footer/styles.scss";
</style>
