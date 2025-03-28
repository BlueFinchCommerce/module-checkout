import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';

import functionExtension from '@/extensions/functionExtension';

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
    setInitialStepState() {
      const { name } = this.$router.currentRoute.value;

      this.setData({
        yourDetailsActive: name === 'DetailsPage' || name === 'ShippingPage' || name === 'PaymentPage',
        shippingActive: name === 'ShippingPage' || name === 'PaymentPage',
        paymentActive: name === 'PaymentPage',
      });
    },
    goToYouDetails() {
      this.setData({
        yourDetailsActive: true,
        shippingActive: false,
        paymentActive: false,
      });
      this.$router.push('/');
    },
    async goToShipping() {
      // If all products within the cart do not require shipping then whenever this is called go directly to payment.
      const { cart } = useCartStore();
      await functionExtension('onSetShippingStep');
      if (!cart.is_virtual) {
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
