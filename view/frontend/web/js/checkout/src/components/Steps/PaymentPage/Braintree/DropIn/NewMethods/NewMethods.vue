<template>
  <div
    id="braintree-drop-in"
    ref="braintreeContainer"
    class="braintree-drop-in"
    data-cy="braintree-drop-in-container"
  />
  <teleport
    v-if="additionalComponents !== ''"
    :to="additionalComponents"
  >
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
      :attached="false"
      :margin="false"
    />
    <CheckboxComponent
      v-if="isLoggedIn && (
        (selectedMethod === 'card' && vaultActive) || (selectedMethod === 'googlepay' && googlepay.vaultActive)
        || (selectedMethod === 'paypal' && paypal.vaultActive)
      )"
      id="braintree-store-method"
      class="braintree-store-method"
      :checked="storeMethod"
      :change-handler="({ currentTarget }) => storeMethod = currentTarget.checked"
      :text="$t('braintree.storePayment')"
      :data-cy="'braintree-save-payment-card-checkbox'"
    />
    <Agreements id="braintreeNew" />
    <Recaptcha
      v-if="isRecaptchaVisible('placeOrder')"
      id="placeOrder"
      location="braintreeNewMethods"
    />
    <PrivacyPolicy />

    <MyButton
      v-if="selectedMethod === 'card'"
      label="Pay"
      primary
      @click="startPayment()"
      :data-cy="'braintree-new-card-pay-button'"
    />
  </teleport>
</template>

<script>
// Stores
import { toRaw } from 'vue';
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';

// Helpers
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';

// Services
import createPayment from '@/services/payments/createPaymentRest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// External
import braintreeWebDropIn from 'braintree-web-drop-in';

export default {
  name: 'BraintreeNewMethods',
  components: {
    Agreements,
    CheckboxComponent,
    ErrorMessage,
    MyButton,
    PrivacyPolicy,
    Recaptcha,
  },
  data() {
    return {
      instance: null,
      storeMethod: false,
      additionalComponents: '',
      paymentOptionPriority: [],
      map: {},
      selectedMethod: null,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'vaultActive',
      'clientToken',
      'threeDSEnabled',
      'threeDSThresholdAmount',
      'alwaysRequestThreeDS',
      'google',
      'paypal',
      'vaultedMethods',
      'errorMessage',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'websiteName', 'superPaymentsActive']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'isLoggedIn']),
    ...mapState(usePaymentStore, [
      'availableMethods',
      'firstOpenController',
      'paymentEmitter',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'getPaymentPriority',
    ]),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
  },
  async created() {
    await this.getInitialConfig();
    await this.createClientToken();
    await this.getCart();

    const total = (this.cartGrandTotal / 100).toString();

    this.map = {
      braintree: 'card',
      braintree_applepay: 'applePay',
      braintree_googlepay: 'googlePay',
      braintree_venmo: 'venmo',
      braintree_paypal: 'paypal',
    };

    const braintreeMethods = this.availableMethods.filter(({ code }) => code.startsWith('braintree'));

    this.paymentOptionPriority = braintreeMethods.map(({ code }) => this.map[code]).filter(Boolean);

    const options = {
      authorization: this.clientToken,
      container: '#braintree-drop-in',
      threeDSecure: false,
      paymentOptionPriority: this.paymentOptionPriority,
      translations: {
        Card: this.getPaymentMethodTitle('braintree'),
        PayPal: this.getPaymentMethodTitle('braintree_paypal'),
      },
    };

    if (this.isPaymentMethodAvailable('braintree')) {
      options.card = {
        vault: {
          allowVaultCardOverride: true,
          vault: this.isLoggedIn,
        },
      };
    }

    if (this.isPaymentMethodAvailable('braintree_applepay')) {
      options.applePay = {
        displayName: this.websiteName,
        paymentRequest: {
          total: {
            label: this.websiteName,
            amount: total,
          },
        },
      };
    }

    if (this.isPaymentMethodAvailable('braintree_googlepay')) {
      options.googlePay = {
        merchantId: this.google.merchantId,
        googlePayVersion: 2,
        transactionInfo: {
          currencyCode: this.currencyCode,
          totalPriceStatus: 'FINAL',
          totalPrice: total,
        },
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: this.google.cCTypes,
            billingAddressRequired: true,
            billingAddressParameters: {
              format: 'FULL',
              phoneNumberRequired: true,
            },
          },
        }],
        button: {
          buttonColor: this.google.buttonColor,
        },
      };
    }

    if (this.isPaymentMethodAvailable('braintree_paypal')) {
      options.paypal = {
        flow: 'checkout',
        amount: total,
        currency: this.currencyCode,
        commit: true,
        lineItems: this.getPayPalLineItems(),
        buttonStyle: {
          color: this.paypal.buttonColor,
          label: this.paypal.buttonLabel,
          shape: this.paypal.buttonShape,
          size: 'responsive',
        },
      };
    }

    if (this.isPaymentMethodAvailable('braintree_venmo')) {
      options.venmo = {
        allowDesktop: true,
      };
    }

    if (this.threeDSEnabled) {
      options.threeDSecure = {
        amount: this.cartGrandTotal / 100,
      };
    }

    braintreeWebDropIn.create(options, this.afterBraintreeInit);
  },

  unmounted() {
    this.removeEventListeners();
  },

  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'createClientToken',
      'unselectVaultedMethods',
      'setClientInstance',
      'setThreeDSInstance',
      'setErrorMessage',
      'clearErrorMessage',
      'escapeNonAsciiCharacters',
      'getPayPalLineItems',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['validateToken']),

    startPayment() {
      this.paymentEmitter.emit('braintreePaymentStart');
      this.requestPaymentMethod()
        .then(this.getPaymentData)
        .then(createPayment)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((paymentError) => {
          this.clearSelectedPaymentMethod();
          this.setToCurrentViewId();

          if (paymentError.name !== 'DropinError') {
            this.setErrorMessage(paymentError?.response?.data?.message || paymentError.message);
          }

          this.paymentEmitter.emit('braintreePaymentError');
        });
    },

    requestPaymentMethod() {
      return new Promise((resolve, reject) => {
        this.setErrorMessage('');
        const agreementsValid = this.validateAgreements();
        const recaptchaValid = this.validateToken('placeOrder');

        if (!agreementsValid || !recaptchaValid) {
          const error = new Error();
          error.name = 'DropinError';
          reject(error);
          return;
        }

        if (!this.instance) {
          reject(new Error('Unable to initialise payment components.'));
        }

        const billingAddress = this.cart.billing_address;

        const firstName = this.escapeNonAsciiCharacters(billingAddress.firstname);
        const lastName = this.escapeNonAsciiCharacters(billingAddress.lastname);
        const formattedBillingAddress = {
          givenName: firstName,
          surname: lastName,
          phoneNumber: billingAddress.telephone,
          streetAddress: billingAddress.street[0],
          extendedAddress: billingAddress.street[1],
          locality: billingAddress.city,
          region: billingAddress.region_code,
          postalCode: billingAddress.postcode,
          countryCodeAlpha2: billingAddress.country_code,
        };

        const price = this.cartGrandTotal / 100;
        const threshold = this.threeDSThresholdAmount;
        const challengeRequested = this.alwaysRequestThreeDS || price >= threshold;

        this.instance.requestPaymentMethod({
          threeDSecure: {
            amount: parseFloat(price).toFixed(2),
            email: this.customer.email,
            billingAddress: formattedBillingAddress,
            challengeRequested,
          },
        }, (error, payload) => {
          if (error) {
            reject(error);
          } else if (payload.liabilityShifted
            || (!payload.liabilityShifted && !payload.liabilityShiftPossible)
            || (payload.type !== 'CreditCard' && payload.type !== 'AndroidPayCard')) {
            this.showLoader();
            resolve(payload);
          } else {
            reject(new Error('There was an error completing validation, please try again.'));
          }
        });
      });
    },

    getPaymentData(payload) {
      return {
        email: this.customer.email,
        paymentMethod: {
          method: this.getBraintreeMethod(payload.type),
          additional_data: {
            payment_method_nonce: payload.nonce,
            is_active_payment_token_enabler: this.storeMethod,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };
    },

    getBraintreeMethod(type) {
      switch (type) {
        case 'AndroidPayCard': return 'braintree_googlepay';
        case 'PayPalAccount': return 'braintree_paypal';
        default: return 'braintree';
      }
    },

    afterBraintreeInit(event, instance) {
      this.setClientInstance(instance._client);

      if (instance._threeDSecure) {
        this.setThreeDSInstance(instance._threeDSecure._instance);
      }

      this.instance = instance;

      this.attachEventListeners(instance);

      // if (!this.superPaymentsActive) {
      //   this.attachEventListeners(instance);
      // } else {
      //   const options = this.$refs.braintreeContainer.querySelectorAll('.braintree-sheet__container .braintree-sheet');
      //   options.forEach((option) => {
      //     option.addEventListener('click', () => {
      //       this.attachEventListeners(instance);
      //     });
      //   });
      // }

      this.movePaymentContainers();

      // If Braintree is controlling the first opened payment method then open that method.
      if (this.firstOpenController === 'braintree') {
        [this.selectedMethod] = this.paymentOptionPriority;
        this.setToCurrentViewId();
      }

      this.paymentEmitter.emit('braintreeInitComplete');

      this.modifyTokenize();
    },

    attachEventListeners(instance) {
      instance.on('changeActiveView', ({ newViewId, previousViewId }) => {
        this.removeActiveClass();

        this.clearErrorMessage();

        if (newViewId === 'methods') {
          this.paymentEmitter.emit('changePaymentMethodDisplay', { visible: false });
          previousViewId !== 'card' && this.startPayment();
        } else if (newViewId !== 'options') {
          // this.addActiveClass(newViewId);
          const id = newViewId === 'card' ? 'braintree' : `braintree_${newViewId}`;
          // this.paymentEmitter.emit('paymentMethodSelected', { id });

          this.selectedMethod = newViewId;

          if (newViewId === 'card') {
            this.additionalComponents = '.braintree-form__flexible-fields';
          } else if (newViewId === 'paypal') {
            this.additionalComponents = 'div[data-braintree-id="paypal-button"]';
          } else if (newViewId === 'googlePay') {
            this.additionalComponents = 'div[data-braintree-id="google-pay-button"]';
          } else if (newViewId === 'applePay') {
            this.additionalComponents = '.braintree-applePay .braintree-sheet__content';
          } else if (newViewId === 'venmo') {
            this.additionalComponents = '.braintree-venmo .braintree-sheet__content';
          }
        }
      });

      instance.on('3ds:customer-canceled', () => {
        const optionsContainer = this.$refs.braintreeContainer.querySelector('.braintree-options');

        if (optionsContainer) {
          this.clearSelectedPaymentMethod();
        }
      });

      this.paymentEmitter.on('paymentMethodSelected', this.clearSelectedMethod);
      // this.paymentEmitter.on('changePaymentMethodDisplay', this.changePaymentMethodDisplay);
      this.paymentEmitter.on('braintreeStoredPaymentCardSelected', this.clearSelectedPaymentMethod);
      this.paymentEmitter.on('braintreePaymentStart', this.showLoader);
      this.paymentEmitter.on('braintreePaymentError', this.hideLoader);
    },

    removeEventListeners() {
      this.paymentEmitter.off('paymentMethodSelected', this.clearSelectedMethod);
      this.paymentEmitter.off('changePaymentMethodDisplay', this.changePaymentMethodDisplay);
      this.paymentEmitter.off('braintreeStoredPaymentCardSelected', this.clearSelectedPaymentMethod);
      this.paymentEmitter.off('braintreePaymentStart', this.showLoader);
      this.paymentEmitter.off('braintreePaymentError', this.hideLoader);
    },

    clearSelectedMethod({ id }) {
      this.unselectVaultedMethods();
      if (!id.startsWith('braintree')
        || id === 'braintree-lpm' || id === 'braintree-vaulted' || id === 'braintree-ach') {
        this.clearSelectedPaymentMethod();
      }

      // On changing the method remove the flag to save the method to the vault.
      this.storeMethod = false;
    },

    changePaymentMethodDisplay({ visible }) {
      const sheets = this.$refs.braintreeContainer.querySelectorAll('.braintree-sheet__container .braintree-sheet');
      sheets.forEach((option) => { option.classList.toggle('braintree-hidden', !visible); });
    },

    movePaymentContainers() {
      const sheets = this.$refs.braintreeContainer.querySelectorAll('.braintree-sheet__container .braintree-sheet');

      sheets.forEach((sheet) => {
        const { braintreeId } = sheet.dataset;
        const matchingContainer = this.$refs.braintreeContainer.querySelector(`.braintree-option__${braintreeId}`);

        if (matchingContainer) {
          const index = Object.values(this.map).findIndex((method) => method === braintreeId);
          const priority = this.getPaymentPriority(Object.keys(this.map)[index]);
          sheet.style.setProperty('--braintree-method-position', priority + 1);
          sheet.prepend(matchingContainer);

          // Move the card payment icons
          if (braintreeId === 'card') {
            const icons = sheet.querySelector('.braintree-sheet__icons');
            matchingContainer.append(icons);
          }
        }
      });
    },

    modifyTokenize() {
      const originalGooglePay = this.instance._mainView._views.googlePay.tokenize
        .bind(toRaw(this.instance._mainView._views.googlePay));

      this.instance._mainView._views.googlePay.tokenize = () => {
        this.setErrorMessage('');
        const agreementsValid = this.validateAgreements();
        const recaptchaValid = this.validateToken('placeOrder');

        if (!agreementsValid || !recaptchaValid) {
          return Promise.resolve();
        }

        return originalGooglePay();
      };

      const originalVenmo = this.instance._mainView._views.venmo.venmoInstance.tokenize
        .bind(this.instance._mainView._views.venmo.venmoInstance);

      this.instance._mainView._views.venmo.venmoInstance.tokenize = () => {
        this.setErrorMessage('');
        const agreementsValid = this.validateAgreements();
        const recaptchaValid = this.validateToken('placeOrder');

        if (!agreementsValid || !recaptchaValid) {
          return Promise.resolve();
        }

        return originalVenmo();
      };

      const originalPayPal = this.instance._mainView._views.paypal.paypalInstance.createPayment
        .bind(this.instance._mainView._views.paypal.paypalInstance);

      this.instance._mainView._views.paypal.paypalInstance.createPayment = (configuration) => {
        this.setErrorMessage('');
        const agreementsValid = this.validateAgreements();
        const recaptchaValid = this.validateToken('placeOrder');

        if (!agreementsValid || !recaptchaValid) {
          return Promise.reject();
        }

        return originalPayPal(configuration);
      };
    },

    addActiveClass(type) {
      const classSearch = type === 'card' ? '.braintree-option__card' : `.braintree-option__${type}`;
      const option = this.$refs.braintreeContainer.querySelector(classSearch);

      if (option) {
        option.classList.add('braintree-option__selected');
      }
    },

    removeActiveClass() {
      const options = this.$refs.braintreeContainer.querySelectorAll('.braintree-option');
      options.forEach((option) => { option.classList.remove('braintree-option__selected'); });
    },

    clearSelectedPaymentMethod() {
      this.instance.clearSelectedPaymentMethod();

      this.paymentEmitter.emit('changePaymentMethodDisplay', { visible: true });
    },

    setToCurrentViewId() {
      this.instance._mainView.setPrimaryView(this.selectedMethod);
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },

    showLoader() {
      this.instance._mainView.showLoadingIndicator();
    },

    hideLoader() {
      this.instance._mainView.hideLoadingIndicator();
    },
  },
};
</script>

<style lang="scss">
@import "@/components/Steps/PaymentPage/Braintree/DropIn/NewMethods/styles.scss";
</style>
