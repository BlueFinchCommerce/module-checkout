<template>
  <div
    v-if="customer.reward_points?.balance?.points && !cart.applied_reward_points?.points"
    class="reward-points"
  >
    <div>
      <span data-cy="rewards-you-have-text">{{ $t('rewards.youHave') }}</span>
      <span class="reward-points-available" data-cy="rewards-points-text">
        {{
          $t('rewards.rewardPoints',
             {
               points: customer.reward_points.balance.points,
             })
        }}
      </span>
      <span data-cy="rewards-available-text">{{ $t('rewards.available') }}</span>
      <span>({{ getFormattedPrice() }})</span>
    </div>
    <MyButton
      :label="$t('rewards.applyButton')"
      :data-cy="'rewards-apply-button'"
      secondary
      @click="useRewardPoints()"
    />
  </div>
  <div
    v-else-if="customer.reward_points?.balance?.points && cart.applied_reward_points?.points"
    class="reward-points"
  >
    <span data-cy="rewards-applied-text">{{ $t('rewards.applied') }}</span>
    <MyButton
      :label="$t('rewards.removeButton')"
      :data-cy="'rewards-remove-button'"
      secondary
      @click="removeRewardPoints()"
    />
  </div>
</template>
<script>
// Stores
import { mapState, mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import formatPrice from '@/helpers/payment/formatPrice';

export default {
  name: 'Rewards',
  components: {
    MyButton,
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useCustomerStore, ['customer']),
  },
  methods: {
    ...mapActions(useCartStore, ['useRewardPoints', 'removeRewardPoints']),
    getFormattedPrice() {
      return formatPrice(this.customer.reward_points.balance.money.value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
