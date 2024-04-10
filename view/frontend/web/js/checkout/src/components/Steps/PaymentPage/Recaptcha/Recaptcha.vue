<template>
  <div
    v-if="getTypeByPlacement(id)"
    :id="location"
    class="recaptcha-container"
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
    ...mapState(useRecaptchaStore, ['getRecaptchaError', 'v2CheckboxKey', 'v2InvisibleKey', 'v3Invisible']),
  },
  async created() {
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
    } else if (recapchaType === recapchaTypes.recaptchaV3) {
      this.renderV3();
    }

    this.paymentEmitter.on('paymentMethodSelected', () => this.resetToken(this.id));
  },
  unmounted() {
    this.paymentEmitter.off('paymentMethodSelected', () => this.resetToken(this.id));
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['addRecaptchaJs', 'getTypeByPlacement', 'setToken', 'resetToken']),

    renderV2() {
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

    renderV2Invisible() {
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
      window.grecaptcha.execute();
    },

    renderV3() {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(this.v3Invisible, { action: 'submit' }).then((token) => {
          this.setToken(this.id, token);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Recaptcha/styles";
</style>
