<template>
  <div
    ref="recaptchaContainer"
    :id="location"
    :class="recaptchaContainerClass"
  />
  <ErrorMessage
    v-if="getRecaptchaError(id)"
    :message="getRecaptchaError(id)"
    :attached="false"
    :margin="false"
  />
</template>
<script>
import { nextTick } from 'vue';
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
  data() {
    return {
      recaptchaWidgetId: null,
    };
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
    recaptchaContainerClass() {
      return this.isRecaptchaVisible(this.id)
        ? 'recaptcha-container'
        : 'recaptcha-container-invisible';
    },
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
      await this.renderV2();
    }
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['addRecaptchaJs', 'getTypeByPlacement', 'setToken', 'resetToken']),

    getRecaptchaContainer() {
      const { recaptchaContainer } = this.$refs;

      return recaptchaContainer instanceof HTMLElement
        ? recaptchaContainer
        : null;
    },

    async renderV2() {
      if (this.recaptchaWidgetId !== null) {
        return;
      }

      this.resetToken(this.id);
      await nextTick();

      const recaptchaContainer = this.getRecaptchaContainer();

      if (!recaptchaContainer || !document.body.contains(recaptchaContainer)) {
        return;
      }

      this.recaptchaWidgetId = window.grecaptcha.render(recaptchaContainer, {
        sitekey: this.v2CheckboxKey,
        callback: (token) => {
          this.setToken(this.id, token);
        },
        'expired-callback': () => {
          this.setToken(this.id, null);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Recaptcha/styles";
</style>
