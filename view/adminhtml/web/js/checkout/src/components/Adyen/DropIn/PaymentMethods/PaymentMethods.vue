<template>
  <template v-if="!storedPayments || storedPaymentMethods.length">
    <Loader v-if="loadingPaymentMethods" />
    <div
      v-if="storedPayments"
      v-show="!isErrorDisplayed && !hideStoredPaymentRadio && paymentVisible"
      class="adyen-dropin-stored-payments"
      :class="{
        'adyen-dropin-stored-payments-active': storedPaymentSelected,
        'adyen-checkout__payment-method--loading': paymentLoading,
      }"
    >
      <RadioButton
        class="adyen-checkout__payment-stored-methods"
        :checked="storedPaymentSelected"
        :text="$t('paymentStep.storedPayments')"
        :change-handler="selectStoredPaymentRadio"
        :disabled="paymentLoading"
      >
        <template #icon>
          <span
            class="adyen-checkout__payment-method__image__wrapper
              adyen-checkout__payment-method__image__wrapper--outline"
          >
            <img
              class="adyen-checkout__payment-method__image
                adyen-checkout__image adyen-checkout__image--loaded"
              src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/card.svg"
              :alt="$t('paymentStep.creditDebitCard')"
            >
          </span>
        </template>
      </RadioButton>
    </div>
    <teleport
      v-if="agreementLocation !== ''"
      :to="agreementLocation"
    >
      <Agreements />
      <PrivacyPolicy />
    </teleport>
    <teleport
      v-if="storedPayments && storedPaymentCardsLocation !== ''"
      :to="storedPaymentCardsLocation"
    >
      <AdyenPaymentCard
        v-for="storedPaymentMethod in storedPaymentMethods"
        v-show="!isErrorDisplayed && paymentVisible"
        :key="storedPaymentMethod.id"
        :method="storedPaymentMethod"
      />
    </teleport>
    <div
      v-show="!isErrorDisplayed && paymentVisible"
      :id="id"
      ref="adyenPayments"
    />
  </template>
</template>

<script>
// stores
import { mapActions, mapState } from 'pinia';
import usePaymentStore from '@/stores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import AdyenPaymentCard from '@/components/Adyen/DropIn/PaymentCard/PaymentCard.vue';
import Agreements from '@/components/Core/Agreements/Agreements.vue';
import Loader from '@/components/Core/Loader/Loader.vue';
import PrivacyPolicy from '@/components/Core/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/Inputs/RadioButton/RadioButton.vue';

// Services
import getAdyenPaymentDetails from '@/services/getAdyenPaymentDetails';
import refreshCustomerData from '@/services/refreshCustomerData';

// Helpers
import getAdditionalPaymentData from '@/helpers/getAdditionalPaymentData';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';

export default {
  name: 'AdyenPaymentMethods',

  components: {
    AdyenPaymentCard,
    Agreements,
    Loader,
    PrivacyPolicy,
    RadioButton,
  },
  props: {
    id: {
      type: String,
      default: 'adyen-dropin-container',
    },
    storedPayments: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['adyenPaymentSelected'],
  data() {
    return {
      agreementLocation: '',
      storedPaymentCardsLocation: '',
      orderId: null,
      storedPaymentMethods: [],
      storedPaymentSelected: false,
      selectedOriginalId: null,
      paymentMethodTitles: null,
      methodSelectedClass: 'adyen-checkout__payment-method--selected',
      isErrorDisplayed: false,
      hideStoredPaymentRadio: false,
      paymentLoading: false,
      paymentVisible: true,
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['loadingPaymentMethods', 'paymentEmitter']),
    ...mapState(useCartStore, ['cartGrandTotal', 'cartItems']),
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale', 'adyenVaultEnabled']),
  },

  async created() {
    await this.getStoreConfig();
  },
  beforeUnmount() {
    if (this.checkout) {
      this.paymentEmitter.all.clear();
      this.checkout.unmount();
      this.clearPaymentReponseCache();
    }
  },
  methods: {
    ...mapActions(usePaymentStore, [
      'getPaymentMethodsResponse', 'getAdyenClientKey', 'clearPaymentReponseCache']),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals', 'validateAgreements']),
    ...mapActions(useConfigStore, ['getAdyenConfig', 'getStoreConfig']),
    ...mapActions(useCustomerStore, ['subscribeToNewsletter']),
    setOrderId(orderId) {
      this.orderId = orderId;
      return orderId;
    },

    getFilteredStoredMethods(paymentMethodsResponse) {
      if (!paymentMethodsResponse.storedPaymentMethods) {
        return [];
      }

      return paymentMethodsResponse.storedPaymentMethods.filter((storedMethod) => (
        storedMethod.supportedShopperInteractions.includes('Ecommerce')
      ));
    },

    getPaymentMethod(state, extensionAttributes) {
      const method = state.data.paymentMethod.type === 'scheme' ? 'adyen_cc' : 'adyen_hpp';
      const additionalPaymentData = getAdditionalPaymentData();
      return {
        method,
        additional_data: {
          brand_code: state.data.paymentMethod.type,
          stateData: JSON.stringify(state.data),
          is_active_payment_token_enabler: !!state.data.storePaymentMethod,
          ...additionalPaymentData,
        },
        extension_attributes: extensionAttributes,
      };
    },
    async handlePaymentStatus(response, dropin) {
      if (response.isFinal) {
        const approvedCodes = [
          'Authorised',
          'Received',
          'PresentToShopper',
        ];
        if (approvedCodes.includes(response.resultCode)) {
          dropin.setStatus('success');
          // Refresh the customers cart to clear any previous quote information before redirecting to success.
          await refreshCustomerData(getCartSectionNames());
          setTimeout(() => this.redirectToSuccess(), 3000);
        } else {
          this.displayError(dropin, response.message);
        }
      } else if (response.action) {
        // If the action is 3DS related then add a class globally so we can display as popup.
        if (response.action.type === 'threeDS2') {
          document.body.classList.add('gene-checkout-threeds-opened');
        }

        dropin.handleAction(response.action);
      }
    },
    async handleAdditionalDetails(state, dropin) {
      try {
        dropin.setStatus('loading');
        document.body.classList.remove('gene-checkout-threeds-opened');
        const request = state.data ? state.data : {};
        request.orderId = this.orderId;
        const response = await getAdyenPaymentDetails(JSON.stringify(request));
        await this.handlePaymentStatus(response, dropin);
      } catch (error) {
        // If the getAdyenPaymentDetails call errors we need to catch it.
        const message = error.response?.data?.message;
        this.displayError(dropin, message);
      }
    },
    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },
    handleOnError(state, dropin) {
      // On 'CANCEL' we need to handle it and send request to cancel the payment against the order.
      if (state.name === 'CANCEL') {
        const request = {
          orderId: this.orderId,
          cancelled: true,
        };
        this.handleOnCancel(request, dropin);
      } else {
        this.displayError(dropin);
      }
    },
    async handleOnCancel(request, dropin) {
      try {
        await getAdyenPaymentDetails(JSON.stringify(request));
      } catch (error) {
        this.displayError(dropin, error.response?.data?.message);
      }
    },

    // Display an error inside of the drop in component.
    displayError(dropin, message = this.$t('errorMessages.unexpectedPaymentError')) {
      this.paymentEmitter.emit('adyenPaymentDisplayingError', { id: this.id, isDisplaying: true });
      dropin.setStatus('error', {
        message,
      });

      // Reset the drop in component back to ready after 3 seconds.
      setTimeout(() => {
        dropin.setStatus('ready');
        this.paymentEmitter.emit('adyenPaymentDisplayingError', { id: this.id, isDisplaying: false });
        this.paymentEmitter.emit('adyenPaymentLoading', { id: this.id, loading: false });

        // If we are on the stored payments compent (and some stored payments exist) then
        // modify the methods to show the payment cards rather that input radios.
        if (this.storedPayments && this.storedPaymentMethods.length) {
          setTimeout(() => this.modifyStoredPayments(), 0);
        }
      }, 3000);
    },

    onSelect(paymentMethod) {
      // Timeout of 500 as this element doesn't exist at the point onSelect is called by Adyen.
      this.paymentEmitter.emit('paymentMethodSelected', {
        id: this.id,
        type: paymentMethod.type,
      });
      setTimeout(() => {
        this.agreementLocation = '';
        setTimeout(() => {
          this.agreementLocation = `.${this.methodSelectedClass}
            .adyen-checkout__payment-method__details`;
        }, 0);
      }, 500);
    },
    modifyStoredPayments() {
      setTimeout(() => {
        // Reset the placement of the stored payment cards before working on them.
        setTimeout(() => { this.storedPaymentCardsLocation = ''; }, 0);

        const paymentContainer = `#${this.id} .adyen-checkout__payment-methods-list`;
        const storedPayments = document.querySelector(paymentContainer);
        const paymentMethods = this.paymentMethodTitles || storedPayments
          .querySelectorAll('.adyen-checkout__payment-method__header__title');

        this.createStyledList(storedPayments, paymentMethods.length);

        this.storedPaymentMethods = this.storedPaymentMethods.map((method, index) => {
          const updatedMethod = method;

          if (!updatedMethod.originalId) {
            updatedMethod.originalId = paymentMethods[index].id;
          }
          return updatedMethod;
        });

        // If there isn't a method selected then set the first to default.
        const hasSelected = this.storedPaymentMethods.find(({ originalId }) => (
          originalId === this.selectedOriginalId
        ));

        if (!hasSelected) {
          this.storedPaymentMethods[0].default = true;
          this.selectedOriginalId = this.storedPaymentMethods[0].originalId;
        }

        this.storedPaymentMethods.forEach((method) => {
          if (method.default) {
            this.paymentEmitter.emit(
              'adyenStoredPaymentCardSelected',
              { originalId: this.selectedOriginalId },
            );
          }
        });
      }, 0);
    },
    createStyledList(storedPayments, paymentMethodCount) {
      const styledList = document.createElement('div');
      styledList.classList.add('adyen-checkout__payment-methods-list-styled');
      styledList.classList.add(`adyen-checkout__payment-methods-list-styled-${paymentMethodCount}`);
      storedPayments.before(styledList);

      // Move the stored payments cards to the correct place.
      setTimeout(() => {
        this.storedPaymentCardsLocation = '.adyen-checkout__payment-methods-list-styled';
      }, 0);
    },
    selectStoredPaymentRadio() {
      // On selecting the stored payment we need to emit an event so that the non-stored payments
      // can update.
      this.paymentEmitter.emit('paymentMethodSelected', {
        id: this.id,
        type: 'adyen_stored_card',
      });
      // Emit the stored payment card selected but with no original ID as they are all going
      // to be unselected by default.
      this.paymentEmitter.emit('adyenStoredPaymentCardSelected', { originalId: this.selectedOriginalId });
    },
  },
};
</script>
<style lang="scss">
@import "./styles.scss";
</style>
