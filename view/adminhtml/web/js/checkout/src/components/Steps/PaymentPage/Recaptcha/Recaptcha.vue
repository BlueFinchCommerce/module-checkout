<template>
  <div
    v-if="getTypeByPlacement(id)"
    :id="id"
  />
</template>
<script>
import { mapState, mapActions } from 'pinia';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Types
import recapchaTypes from '@/helpers/types/getRecaptchaTypes';

export default {
  name: 'Recaptcha',
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    ...mapState(useRecaptchaStore, ['v2CheckboxKey', 'v2InvisibleKey', 'v3Invisible']),
  },
  async created() {
    await this.getRecaptchaConfiguration();

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
  },
  methods: {
    ...mapActions(useRecaptchaStore, ['addRecaptchaJs', 'getRecaptchaConfiguration', 'getTypeByPlacement', 'setToken']),

    renderV2() {
      window.grecaptcha.render(this.id, {
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
      window.grecaptcha.render(this.id, {
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
