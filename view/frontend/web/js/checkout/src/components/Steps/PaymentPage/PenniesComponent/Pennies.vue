<template>
  <div class="pennies-trigger dropdown-button"
       :class="{opened: true}"
       v-if="penniesDonation.enabled && (penniesDonation.amount > 0 || hasPenniesDonation)">
    <TextField
      :text="$t('donation.donateTitle')"
      class="pennies-container__title"
    />
  </div>
  <DropDown
    v-show="true"
    class="pennies-container__dropdown"
    :class="{active: true}"
    v-if="penniesDonation.enabled && (penniesDonation.amount > 0 || hasPenniesDonation)">
    <template #content>
      <div class="pennies-container">
        <div class="pennies-container__logo">
          <img class="pennies-container__logo__img" :src="penniesDonation.logo" :alt="$t('donation.penniesLogo')">
          <img class="pennies-container__logo__img" :src="CharityLogo"
               :alt="$t('donation.charityLogo')">
        </div>

        <div class="pennies-container__divider"></div>

        <div
          v-if="penniesDonation.amount > 0"
          class="pennies-container__donate-text"
        >
          <span>{{ penniesDonation.charityData.soundbite }}</span>
        </div>

        <div class="pennies-container__donate-buttons">
          <MyButton
            v-if="penniesDonation.isAvailable && !hasPenniesDonation"
            :label="donationText"
            @click="addDonation"
          />
          <MyButton
            v-else
            :label="$t('donation.removeDonation')"
            @click="removeDonation"
          />
        </div>

        <div class="pennies-container__subtitle">
          <span :class="showFullText ? 'full' : 'hidden'">{{ penniesDonation.charityData.message }}</span>
          <span :class="showFullText ? 'more' : 'less'" @click="showMoreLess" @keydown="showMoreLess">
            {{ showFullText ? $t('donation.less') : $t('donation.more') }}
          </span>
        </div>
      </div>
    </template>
  </DropDown>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import getStaticUrl from '@/helpers/getStaticPath';

// stores
import useCartStore from '@/stores/CartStore';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import DropDown from '@/components/Core/DropDown/DropDown.vue';
import MyButton from '@/components/Core/Button/Button.vue';

// charity logo
import charityLogo from '@/icons/charityLogo.png';

// helpers
import formatPrice from '@/helpers/formatPrice';

export default {
  name: 'PenniesComponent',
  components: {
    TextField,
    DropDown,
    MyButton,
  },
  data() {
    return {
      showFullText: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['penniesDonation', 'hasPenniesDonation']),
    CharityLogo() {
      return `${getStaticUrl(charityLogo)}`;
    },
    donationText() {
      return `${this.$t('donation.donateText')} ${formatPrice(this.penniesDonation.amount)}`;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['addDonation',
      'calculateDonation',
      'removeDonation',
      'penniesConfigs']),

    showMoreLess() {
      this.showFullText = !this.showFullText;
    },
  },
  async mounted() {
    await this.calculateDonation();
    await this.penniesConfigs();
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
