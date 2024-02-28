import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';

export default defineStore('stepsStore', {
  state: () => ({
    yourDetailsActive: true,
    shippingActive: false,
    paymentActive: false,
  }),
  actions: {
    setData(data) {
      this.$patch(data);
    },
    goToYouDetails() {
      this.setData({
        yourDetailsActive: true,
        shippingActive: false,
        paymentActive: false,
      });
      this.$router.push('/');
    },
    goToShipping() {
      // If all products within the cart do not require shipping then whenever this is called go directly to payment.
      const { isItemRequiringDelivery } = useCartStore();

      if (isItemRequiringDelivery) {
        this.setData({
          yourDetailsActive: true,
          shippingActive: true,
          paymentActive: false,
        });
        this.$router.push('/shipping');
      } else {
        this.goToPayment();
      }
    },
    goToPayment() {
      this.setData({
        yourDetailsActive: true,
        shippingActive: true,
        paymentActive: true,
      });
      this.$router.push('/payments');
    },
  },
});
