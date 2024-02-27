<template>
  <template v-if="(!storedPayments || storedPaymentMethods.length)">
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
import useAdyenStore from '@/stores/AdyenStore';
import usePaymentStore from '@/stores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

// Components
import AdyenPaymentCard from '@/components/Adyen/DropIn/PaymentCard/PaymentCard.vue';
import Agreements from '@/components/Core/Agreements/Agreements.vue';
import Loader from '@/components/Core/Loader/Loader.vue';
import PrivacyPolicy from '@/components/Core/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/Inputs/RadioButton/RadioButton.vue';

// Services
import createPayment from '@/services/createPayment';
import getAdyenPaymentStatus from '@/services/getAdyenPaymentStatus';
import getAdyenPaymentDetails from '@/services/getAdyenPaymentDetails';
import refreshCustomerData from '@/services/refreshCustomerData';

// Helpers
import getAdditionalPaymentData from '@/helpers/getAdditionalPaymentData';
import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
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
    ...mapState(useAdyenStore, ['adyenVaultEnabled', 'loadingPaymentMethods']),
    ...mapState(usePaymentStore, ['paymentEmitter']),
    ...mapState(useCartStore, ['cartGrandTotal', 'cartItems']),
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale']),
  },

  async created() {
    await this.getStoreConfig();
    await this.getAdyenConfig();
    await this.getCartData();
    await this.getCart();
    await this.getCartTotals();

    const paymentMethodsResponse = await this.getPaymentMethodsResponse();

    this.storedPaymentMethods = this.getFilteredStoredMethods(paymentMethodsResponse);

    // If we are on a stored payment component but have no stored payments
    // available then we can return early.
    if (this.storedPayments && !this.storedPaymentMethods.length) {
      return;
    }

    this.storedPaymentSelected = true;

    const clientKey = await this.getAdyenClientKey();
    const extensionAttributes = getPaymentExtensionAttributes();
    const configuration = {
      paymentMethodsResponse,
      clientKey,
      locale: this.locale,
      environment: getAdyenProductionMode() ? 'live' : 'test',
      analytics: {
        enabled: false,
      },
      amount: {
        value: this.cartGrandTotal,
        currency: this.currencyCode,
      },
      showPaymentMethods: !this.storedPayments,
      onAdditionalDetails: this.handleAdditionalDetails.bind(this),
      onError: this.handleOnError.bind(this),
      onSubmit: (state, dropin) => {
        // Check that the agreements (if any) are valid.
        state.isValid = this.validateAgreements();

        if (state.isValid) {
          const paymentMethod = this.getPaymentMethod(state, extensionAttributes);
          const data = {
            billingAddress: this.getSelectedBillingAddress,
            paymentMethod,
            email: this.customer.email,
          };

          this.paymentEmitter.emit('adyenPaymentLoading', { id: this.id, loading: true });

          createPayment(data)
            .then(this.setOrderId)
            .then(getAdyenPaymentStatus)
            .then(async (response) => {
              await this.subscribeToNewsletter();
              return response;
            })
            .then((response) => this.handlePaymentStatus(response, dropin))
            .catch((error) => {
              this.displayError(dropin, error.response?.data?.message).bind(this);
              throw Error(error);
            });
        } else {
          this.displayError(dropin, this.$t('agreements.paymentErrorMessage'));
        }
      },
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: false,
          holderNameRequired: false,
          enableStoreDetails: this.isLoggedIn && this.adyenVaultEnabled,
          hideCVC: false,
          name: 'Credit or debit card',
        },
        threeDS2: {
          challengeWindowSize: '05',
        },
      },
    };

    const adyenCheckout = await AdyenCheckout(configuration);
    this.checkout = adyenCheckout
      .create('dropin', {
        showStoredPaymentMethods: this.storedPayments,
        showPaymentMethods: !this.storedPayments,
        openFirstPaymentMethod: !this.storedPaymentMethods.length,
        openFirstStoredPaymentMethod: this.storedPaymentMethods.length,
        setStatusAutomatically: false,
        onSelect: this.onSelect,
      });
    this.checkout.mount(`#${this.id}`);

    // If we are on the stored payments compent (and some stored payments exist) then
    // modify the methods to show the payment cards rather that input radios.
    if (this.storedPayments && this.storedPaymentMethods.length) {
      // Created a mutation observer to handle when the drop in component is actually ready
      // because Adyen doesn't provide a useful callback to trigger this.
      const target = document.getElementById('adyen-dropin-container-new');
      const config = { childList: true, subtree: true };
      const callback = (mutationList, observer) => {
        // Check that the newly added element has the class 'ready' on it and when it does trigger the modifications
        // and disconnect the observer.
        const isReady = mutationList.some((mutation) => (
          mutation.target.classList.contains('adyen-checkout__dropin--ready')
        ));
        if (isReady) {
          this.modifyStoredPayments();
          observer.disconnect();
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(target, config);
    }

    // If an error is displaying we can hide the payment methods.
    this.paymentEmitter.on('adyenPaymentDisplayingError', ({ id, isDisplaying }) => {
      if (this.id !== id) {
        this.isErrorDisplayed = isDisplaying;
      }
      this.hideStoredPaymentRadio = isDisplaying;
    });

    this.paymentEmitter.on('adyenPaymentLoading', ({ id, loading }) => {
      if (this.id !== id) {
        loading ? this.checkout.setStatus('loading') : this.checkout.setStatus('ready');
        this.paymentLoading = loading;
      }
    });

    // On payment selected close all active methods.
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      // Only do this for example if a stored payment is selected and new card is open.
      if (this.id !== id && this.checkout.dropinRef) {
        this.checkout.dropinRef.closeActivePaymentMethod();
      }

      // Set the stored payment radio field state depending on if it matches
      // the current ID.
      this.storedPaymentSelected = this.id === id;
    });

    this.paymentEmitter.on('adyenStoredPaymentCardSelected', ({ originalId }) => {
      // Update the selected method.
      this.storedPaymentMethods = this.storedPaymentMethods.map((storedMethod) => {
        const updatedMethod = storedMethod;
        updatedMethod.default = originalId === storedMethod.originalId;
        return updatedMethod;
      });

      if (originalId) {
        const originalButton = document.getElementById(originalId);
        originalButton.click();
        this.selectedOriginalId = originalId;
      }
    });

    this.paymentEmitter.on('changePaymentMethodDisplay', ({ visible }) => {
      this.paymentVisible = visible;
    });
  },
  beforeUnmount() {
    if (this.checkout) {
      this.paymentEmitter.all.clear();
      this.checkout.unmount();
      this.clearPaymentReponseCache();
    }
  },
  methods: {
    ...mapActions(useAdyenStore, [
      'getAdyenConfig',
      'getAdyenClientKey',
      'getPaymentMethodsResponse',
      'clearPaymentReponseCache',
    ]),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals', 'validateAgreements']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
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
