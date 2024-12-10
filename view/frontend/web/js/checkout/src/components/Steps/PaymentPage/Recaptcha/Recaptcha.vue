<template>
  <div
    v-if="isRecaptchaVisible(id)"
    :id="location"
    class="recaptcha-container"
  />
  <div
    v-else
    :id="location"
    class="recaptcha-container-invisible"
  />
  <ErrorMessage
    v-if="getRecaptchaError(id)"
    :message="getRecaptchaError(id)"
    :attached="false"
    :margin="false"
  />
</template>
<script>
import { mapState, mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Components
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';

// Types
import recapchaTypes from '@/helpers/types/getRecaptchaTypes';

export default {
  name: 'Recaptcha',
  components: {
    ErrorMessage,
  },
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
    location: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter']),
    ...mapState(useRecaptchaStore, [
      'getRecaptchaError',
      'isRecaptchaVisible',
      'v2CheckboxKey',
      'v2InvisibleKey',
      'v3Invisible',
    ]),
  },
  async mounted() {
    await this.getInitialConfig();

    const recapchaType = this.getTypeByPlacement(this.id);

    // Early return if this type isn't enabled.
    if (!recapchaType) {
      return;
    }

    await this.addRecaptchaJs(recapchaType);

    if (recapchaType === recapchaTypes.recaptchaV2) {
      this.renderV2();
    } else if (recapchaType === recapchaTypes.invisible) {
      this.renderV2Invisible();
    }
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['addRecaptchaJs', 'getTypeByPlacement', 'setToken', 'resetToken']),

    renderV2() {
      this.resetToken(this.id);
      window.grecaptcha.render(this.location, {
        sitekey: this.v2CheckboxKey,
        callback: (token) => {
          this.setToken(this.id, token);
        },
        'expired-callback': () => {
          this.setToken(this.id, null);
        },
      });
    },

    async renderV2Invisible() {
      window.grecaptcha.render(this.location, {
        sitekey: this.v2InvisibleKey,
        size: 'invisible',
        callback: (token) => {
          this.setToken(this.id, token);
        },
        'expired-callback': () => {
          this.setToken(this.id, null);
        },
      });
      await window.grecaptcha.execute();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Recaptcha/styles";
</style>
