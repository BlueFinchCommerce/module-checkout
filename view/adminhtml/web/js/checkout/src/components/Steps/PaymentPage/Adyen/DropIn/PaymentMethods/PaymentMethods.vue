<template>
  <div
    v-if="!loadingPaymentMethods"
    class="adyen-payment__title"
  >
    <Payment
      class="adyen-payment__icon"
      fill="black"
    />
    <TextField
      class="adyen-payment__header"
      :text="paymentStepText"
    />
    <div class="divider-line" />
  </div>
  <template v-if="!storedPayments || storedPaymentMethods.length">
    <Loader v-if="loadingPaymentMethods" />
    <teleport
      v-if="agreementLocation !== ''"
      :to="agreementLocation"
    >
      <Agreements :id="`adyenDropIn-${storedPayments ? 'stored' : 'new'}`" />
      <PrivacyPolicy />
    </teleport>
    <teleport
      v-if="storedPayments && storedPaymentCardsLocation !== ''"
      :to="storedPaymentCardsLocation"
    >
      <AdyenPaymentCard
        v-for="storedPaymentMethod in storedPaymentMethods"
        v-show="!isErrorDisplayed && paymentVisible"
        :class="{'adyen-stored-payment-selected': storedPaymentSelected}"
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
import AdyenCheckout from '@adyen/adyen-web';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

import '@adyen/adyen-web/dist/adyen.css';

// Components
import AdyenPaymentCard from '@/components/Steps/PaymentPage/Adyen/DropIn/PaymentCard/PaymentCard.vue';
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import getAdyenPaymentStatus from '@/services/adyen/getAdyenPaymentStatus';
import getAdyenPaymentDetails from '@/services/adyen/getAdyenPaymentDetails';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Helpers
import getAdyenProductionMode from '@/helpers/payment/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

export default {
  name: 'AdyenPaymentMethods',

  components: {
    AdyenPaymentCard,
    Agreements,
    Loader,
    PrivacyPolicy,
    Payment,
    TextField,
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
      paymentStepText: '',
      paymentStepTextStoredId: 'gene-bettercheckout-paymentstep-text-stored',
      paymentStepTextNewId: 'gene-bettercheckout-paymentstep-text-new',
      paymentStepTextGuestId: 'gene-bettercheckout-paymentstep-text-guest',
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['adyenVaultEnabled', 'loadingPaymentMethods']),
    ...mapState(usePaymentStore, ['paymentEmitter']),
    ...mapState(useCartStore, ['cartGrandTotal', 'cartItems']),
    ...mapState(useCustomerStore, [
      'customer',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale', 'storeCode']),
  },

  async created() {
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    await this.getAdyenConfig();

    const paymentMethodsResponse = await this.getPaymentMethodsResponse();

    this.storedPaymentMethods = this.getFilteredStoredMethods(paymentMethodsResponse);

    // If we are on a stored payment component but have no stored payments
    // available then we can return early.
    if (this.storedPayments && !this.storedPaymentMethods.length) {
      return;
    }

    // The titles need to be reflective of the state we're in.
    if (this.storedPayments) {
      this.paymentStepText = window.geneCheckout?.[this.paymentStepTextStoredId]
        || this.$t('paymentStep.titleStored');
    } else if (this.storedPaymentMethods.length) {
      this.paymentStepText = window.geneCheckout?.[this.paymentStepTextNewId]
        || this.$t('paymentStep.titleNew');
    } else {
      this.paymentStepText = window.geneCheckout?.[this.paymentStepTextGuestId]
        || this.$t('paymentStep.titleGuest');
    }

    document.addEventListener(this.paymentStepTextStoredId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextNewId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextGuestId, this.setPaymentStepText);

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

          this.paymentEmitter.emit('adyenPaymentLoading', { id: this.id, loading: true });

          createPayment(paymentMethod)
            .then(this.setOrderId)
            .then(getAdyenPaymentStatus)
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

      // If the selected method isn't a stored method then reset all stored method selection.
      if (id !== 'adyen-dropin-container-stored') {
        this.storedPaymentMethods = this.storedPaymentMethods.map((storedMethod) => {
          const updatedMethod = storedMethod;
          updatedMethod.default = false;
          return updatedMethod;
        });
      }
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
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setPaymentStepText(event) {
      if (event?.detail) {
        this.paymentStepText = event.detail;
        return;
      }

      if (this.storedPayments) {
        this.paymentStepText = this.$t('paymentStep.titleStored');
      } else if (this.storedPaymentMethods.length) {
        this.paymentStepText = this.$t('paymentStep.titleNew');
      } else {
        this.paymentStepText = this.$t('paymentStep.titleGuest');
      }
    },

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

    getPaymentMethod(state) {
      const paymentMethod = {
        code: state.data.paymentMethod.type === 'scheme' ? 'adyen_cc' : 'adyen_hpp',
      };
      const stateData = JSON.stringify(state.data);

      if (paymentMethod.code === 'adyen_cc') {
        paymentMethod.adyen_additional_data_cc = {
          cc_type: state.data.paymentMethod.brand,
          stateData,
          recurringProcessingModel: 'CardOnFile',
          is_active_payment_token_enabler: true,
        };
      } else {
        paymentMethod.adyen_additional_data_hpp = {
          brand_code: state.data.paymentMethod.type,
          stateData,
        };
      }

      return paymentMethod;
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

        this.updateAgreementLocation();
      }, 3000);
    },

    onSelect(paymentMethod) {
      this.paymentEmitter.emit('paymentMethodSelected', {
        id: this.id,
        type: paymentMethod.type,
      });
      setTimeout(this.updateAgreementLocation, 0);
    },

    updateAgreementLocation() {
      this.agreementLocation = '';
      setTimeout(() => {
        this.agreementLocation = `.${this.methodSelectedClass}
            .adyen-checkout__payment-method__details`;
      }, 0);
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
  },
};
</script>
<style lang="scss">
@import "./styles.scss";
</style>
