<template>
  <div
    id="fastlaneEmailWatermark"
    ref="fastlaneEmailWatermark"
  />
</template>

<script>
import { mapActions } from 'pinia';
import useFastlaneStore from '@/stores/PaymentStores/FastlaneStore';

export default {
  name: 'Fastlane',

  async mounted() {
    await this.setup();
    this.attachEmailListener();

    this.renderWatermark(`#${this.$refs.fastlaneEmailWatermark.id}`);
  },

  methods: {
    ...mapActions(useFastlaneStore, ['setup', 'attachEmailListener', 'renderWatermark']),
  },
};

</script>
