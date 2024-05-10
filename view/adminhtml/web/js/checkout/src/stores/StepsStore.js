import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';

export default defineStore('stepsStore', {
  state: () => ({
    signInPage: true,
    yourDetailsActive: false,
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
        signInPageActive: name === 'SignInPage' || name === 'DetailsPage'
        || name === 'ShippingPage' || name === 'PaymentPage',
        yourDetailsActive: name === 'DetailsPage' || name === 'ShippingPage' || name === 'PaymentPage',
        shippingActive: name === 'ShippingPage' || name === 'PaymentPage',
        paymentActive: name === 'PaymentPage',
      });
    },
    goToSignInPage() {
      this.setData({
        signInPage: true,
        yourDetailsActive: false,
        shippingActive: false,
        paymentActive: false,
      });
      this.$router.push('/');
    },
    goToYouDetails() {
      this.setData({
        signInPage: false,
        yourDetailsActive: true,
        shippingActive: false,
        paymentActive: false,
      });
      this.$router.push('/details');
    },
    goToShipping() {
      // If all products within the cart do not require shipping then whenever this is called go directly to payment.
      const { isItemRequiringDelivery } = useCartStore();

      if (isItemRequiringDelivery) {
        this.setData({
          signInPage: false,
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
        signInPage: false,
        yourDetailsActive: true,
        shippingActive: true,
        paymentActive: true,
      });
      this.$router.push('/payments');
    },
    goToAdyenAmazonReviw() {
      this.setData({
        signInPage: true,
        yourDetailsActive: true,
        shippingActive: true,
        paymentActive: true,
      });
      this.$router.push('/adyen-amazon-review');
    },
  },
});
