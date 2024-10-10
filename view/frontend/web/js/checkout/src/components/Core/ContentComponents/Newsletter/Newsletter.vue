<template>
  <div
    v-if="newsletterEnabled
      && ((!isLoggedIn && newsletterAllowGuests) || (isLoggedIn && !newsletter.isSubscribed))"
    class="newsletter-container"
  >
    <Checkbox
      id="newsletter-signup"
      :checked="newsletter.subscribeToNewsletter"
      :text="$t('newsletter.label')"
      :change-handler="changeNewsletterSubscription"
      :data-cy="'newsletter-signup-checkbox'"
    />
  </div>
</template>

<script>

// Stores
import { mapActions, mapState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import Checkbox from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';

export default {
  name: 'Newsletter',
  components: {
    Checkbox,
  },
  computed: {
    ...mapState(useConfigStore, ['newsletterEnabled', 'newsletterAllowGuests']),
    ...mapState(useCustomerStore, ['isLoggedIn', 'newsletter']),
  },
  methods: {
    ...mapActions(useCustomerStore, ['updateNewsletterSubscription']),
    changeNewsletterSubscription(event) {
      const { target } = event;
      if (typeof target.checked !== 'undefined') {
        this.updateNewsletterSubscription(target.checked);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles";
</style>
