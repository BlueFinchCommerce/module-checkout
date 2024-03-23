<template>
  <div class="payment-step">
    <SavedDeliveryAddress />
    <SavedShippingMethod />
    <div class="payment-page">
      <div class="payment-form">
        <div id="amazonpay_order-container" />
        <button
          v-if="state === 'loading'"
          class="adyen-checkout__button adyen-checkout__button--pay adyen-checkout__button--loading"
          type="button"
          disabled=""
        >
          <div class="adyen-checkout__spinner__wrapper ">
            <div class="adyen-checkout__spinner adyen-checkout__spinner--medium" />
          </div>
        </button>
        <div
          v-else-if="state === 'error'"
          class="adyen-checkout__status adyen-checkout__status--error"
        >
          <img
            class="adyen-checkout__status__icon adyen-checkout__image adyen-checkout__image--loaded"
            src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/error.gif"
            alt="An unknown error occurred"
            height="88"
          >
          <span class="adyen-checkout__status__text">{{ errorMessage }}</span>
        </div>
        <div
          v-else
          class="adyen-checkout__status adyen-checkout__status--success"
        >
          <img
            height="88"
            class="adyen-checkout__status__icon adyen-checkout__image adyen-checkout__image--loaded"
            src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/success.gif"
            alt="Payment Successful"
          >
          <span class="adyen-checkout__status__text">{{ $t('adyen.paymentSuccessful') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useStepsStore from '@/stores/StepsStore';

import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

// Components
import SavedDeliveryAddress from
  '@/components/Steps/CustomerInfoPage/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import getAdyenPaymentStatus from '@/services/adyen/getAdyenPaymentStatus';
import getAdyenPaymentDetails from '@/services/adyen/getAdyenPaymentDetails';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Helpers
import getAdyenProductionMode from '@/helpers/payment/getAdyenProductionMode';
import formatPrice from '@/helpers/payment/formatPrice';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getUrlQuery from '@/helpers/storeConfigs/getUrlQuery';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

export default {
  name: 'AdyenAmazonReview',
  components: {
    SavedDeliveryAddress,
    SavedShippingMethod,
  },
  data() {
    return {
      orderId: null,
      state: 'loading',
      errorMessage: '',
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['getAdyenClientKey']),
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useConfigStore, ['currencyCode', 'locale', 'storeCode']),
    ...mapState(useCustomerStore, ['customer', 'getSelectedBillingAddress']),
    formattedTotal() {
      return formatPrice(this.cartGrandTotal / 100);
    },
  },
  async created() {
    // Get the Amazon checkout sessionID.
    const amazonCheckoutSessionId = getUrlQuery('amazonCheckoutSessionId');

    await this.getInitialConfig();
    await this.getCart();

    const paymentMethodsResponse = await this.getPaymentMethodsResponse();
    const extensionAttributes = getPaymentExtensionAttributes();
    const configuration = {
      paymentMethodsResponse,
      clientKey: this.getAdyenClientKey,
      amount: {
        value: this.cartGrandTotal,
        currency: this.currencyCode,
      },
      locale: this.locale,
      environment: getAdyenProductionMode() ? 'live' : 'test',
      analytics: {
        enabled: false,
      },
      onAdditionalDetails: this.handleAdditionalDetails.bind(this),
      onSubmit: (state, component) => {
        this.state = 'loading';

        const paymentMethod = this.getPaymentMethod(state, extensionAttributes);
        const data = {
          billingAddress: this.getSelectedBillingAddress,
          paymentMethod,
          email: this.customer.email,
        };

        createPayment(data)
          .then(this.setOrderId)
          .then(getAdyenPaymentStatus)
          .then((response) => this.handlePaymentStatus(response, component))
          .catch((error) => {
            this.displayError(error.response?.data?.message);
          });
      },
      paymentMethodsConfiguration: {
        threeDS2: {
          challengeWindowSize: '05',
        },
      },
    };
    const checkout = await AdyenCheckout(configuration);
    const config = {
      amazonCheckoutSessionId,
      showOrderButton: false,
    };
    const amazonPayComponent = checkout
      .create('amazonpay', config)
      .mount('#amazonpay_order-container');

    window.amazonPayComponent = amazonPayComponent;
    amazonPayComponent.submit();
  },
  methods: {
    ...mapActions(useAdyenStore, ['getPaymentMethodsResponse']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),

    setOrderId(orderId) {
      this.orderId = orderId;
      return orderId;
    },

    async handleAdditionalDetails(state, component) {
      try {
        this.state = 'loading';
        document.body.classList.remove('gene-checkout-threeds-opened');
        const request = state.data ? state.data : {};
        request.orderId = this.orderId;
        const response = await getAdyenPaymentDetails(JSON.stringify(request));
        await this.handlePaymentStatus(response, component);
      } catch (error) {
        // If the getAdyenPaymentDetails call errors we need to catch it.
        const message = error.response?.data?.message;
        this.displayError(message);
      }
    },

    getPaymentMethod(state, extensionAttributes) {
      const method = state.data.paymentMethod.type === 'scheme' ? 'adyen_cc' : 'adyen_hpp';
      return {
        method,
        additional_data: {
          brand_code: state.data.paymentMethod.type,
          stateData: JSON.stringify(state.data),
          is_active_payment_token_enabler: !!state.data.storePaymentMethod,
        },
        extension_attributes: extensionAttributes,
      };
    },

    async handlePaymentStatus(response, component) {
      if (response.isFinal) {
        const approvedCodes = [
          'Authorised',
          'Received',
          'PresentToShopper',
        ];
        if (approvedCodes.includes(response.resultCode)) {
          this.state = 'success';
          // Refresh the customers cart to clear any previous quote information before redirecting to success.
          await refreshCustomerData(getCartSectionNames());
          setTimeout(() => this.redirectToSuccess(), 3000);
        } else {
          this.displayError(response.message);
        }
      } else if (response.action) {
        // If the action is 3DS related then add a class globally so we can display as popup.
        if (response.action.type === 'threeDS2') {
          document.body.classList.add('gene-checkout-threeds-opened');
        }

        component.handleAction(response.action);
      }
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },

    // Display an error inside of the drop in component.
    displayError(message = this.$t('errorMessages.unexpectedPaymentError')) {
      this.state = 'error';
      this.errorMessage = message;

      // Reset the drop in component back to ready after 3 seconds.
      setTimeout(() => {
        // Redirect to the main payment page after displaying the error to allow the User to try a different method.
        const stepsStore = useStepsStore();
        stepsStore.goToPayment();
        window.history.replaceState({}, '', '/checkout/#/payments');
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles";
</style>
