<template>
  <div
    id="braintree-drop-in"
    ref="braintreeContainer"
    class="braintree-drop-in"
  />
  <teleport
    v-if="saveVaultLocation !== ''"
    :to="saveVaultLocation"
  >
    <CheckboxComponent
      v-if="isLoggedIn"
      id="braintree-store-method"
      class="braintree-store-method"
      :checked="storeMethod"
      :change-handler="({ currentTarget }) => storeMethod = currentTarget.checked"
      :text="$t('braintree.storePayment')"
    />
    <MyButton
      label="Pay"
      primary
      @click="startPayment()"
    />
  </teleport>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useBraintreeStore from '@/stores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';

// Components
import CheckboxComponent from '@/components/Core/Inputs/Checkbox/Checkbox.vue';
import MyButton from '@/components/Core/Button/Button.vue';

// Helpers
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';

// Services
import createPayment from '@/services/createPayment';
import refreshCustomerData from '@/services/refreshCustomerData';

// External
import braintreeWebDropIn from 'braintree-web-drop-in';

export default {
  name: 'BraintreeNewMethods',
  components: {
    CheckboxComponent,
    MyButton,
  },
  data() {
    return {
      instance: null,
      storeMethod: false,
      saveVaultLocation: '',
      paymentOptionPriority: [],
      map: {},
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
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'websiteName']),
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'getSelectedBillingAddress', 'isLoggedIn']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'getPaymentPriority',
    ]),
  },
  async created() {
    await this.getStoreConfig();
    await this.getPaymentMethods();
    await this.getBraintreeConfig();
    await this.createClientToken();

    const total = (this.cartGrandTotal / 100).toString();

    this.map = {
      braintree: 'card',
      braintree_applepay: 'applePay',
      braintree_googlepay: 'googlePay',
      braintree_venmo: 'venmo',
      braintree_paypal: 'paypal',
    };

    const sortedAvailableMethods = Object.keys(this.map).toSorted((a, b) => (
      this.getPaymentPriority(a) - this.getPaymentPriority(b)
    ));
    this.paymentOptionPriority = sortedAvailableMethods.map((method) => this.map[method]);

    const options = {
      authorization: this.clientToken,
      container: '#braintree-drop-in',
      threeDSecure: false,
      paymentOptionPriority: this.paymentOptionPriority,
      card: {
        vault: {
          allowVaultCardOverride: true,
          vault: this.isLoggedIn,
        },
      },
      applePay: {
        displayName: this.websiteName,
        paymentRequest: {
          total: {
            label: this.websiteName,
            amount: total,
          },
        },
      },
      googlePay: {
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
      },
      paypal: {
        flow: 'checkout',
        amount: total,
        currency: this.currencyCode,
        commit: true,
        lineItems: this.getPayPalLineItems(),
        buttonStyle: {
          color: this.paypal.buttonColor,
          label: this.paypal.buttonLabel,
          shape: this.paypal.buttonShape,
        },
      },
      venmo: {
        allowDesktop: true,
      },
      translations: {
        Card: this.getPaymentMethodTitle('braintree'),
        PayPal: this.getPaymentMethodTitle('braintree_paypal'),
      },
    };

    if (this.threeDSEnabled) {
      options.threeDSecure = {
        amount: this.cartGrandTotal / 100,
      };
    }

    braintreeWebDropIn.create(options, this.afterBraintreeInit);
  },

  methods: {
    ...mapActions(useBraintreeStore, [
      'getBraintreeConfig',
      'createClientToken',
      'unselectVaultedMethods',
      'setClientInstance',
      'setThreeDSInstance',
      'setErrorMessage',
      'clearErrorMessage',
      'escapeNonAsciiCharacters',
      'getPayPalLineItems',
    ]),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['subscribeToNewsletter']),
    ...mapActions(usePaymentStore, ['getPaymentMethods']),

    startPayment() {
      this.paymentEmitter.emit('braintreePaymentStart');
      this.requestPaymentMethod()
        .then(this.getPaymentData)
        .then(createPayment)
        .then(this.subscribeToNewsletter)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((paymentError) => {
          if (paymentError.name !== 'DropinError') {
            this.clearSelectedPaymentMethod();
            this.setErrorMessage(paymentError?.response?.data?.message || paymentError.message);
          }
          this.paymentEmitter.emit('braintreePaymentError');
        });
    },

    requestPaymentMethod() {
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          reject(new Error('Unable to initialise payment components.'));
        }

        const firstName = this.escapeNonAsciiCharacters(this.getSelectedBillingAddress.firstname);
        const lastName = this.escapeNonAsciiCharacters(this.getSelectedBillingAddress.lastname);
        const billingAddress = {
          givenName: firstName,
          surname: lastName,
          phoneNumber: this.getSelectedBillingAddress.telephone,
          streetAddress: this.getSelectedBillingAddress.street[0],
          extendedAddress: this.getSelectedBillingAddress.street[1],
          locality: this.getSelectedBillingAddress.city,
          region: this.getSelectedBillingAddress.region_code,
          postalCode: this.getSelectedBillingAddress.postcode,
          countryCodeAlpha2: this.getSelectedBillingAddress.country_code,
        };

        const price = this.cartGrandTotal / 100;
        const threshold = this.threeDSThresholdAmount;
        const challengeRequested = this.alwaysRequestThreeDS || price >= threshold;

        this.instance.requestPaymentMethod({
          threeDSecure: {
            amount: parseFloat(price).toFixed(2),
            email: this.customer.email,
            billingAddress,
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
        code: this.getBraintreeMethod(payload.type),
        braintree: {
          payment_method_nonce: payload.nonce,
          is_active_payment_token_enabler: this.storeMethod,
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
      this.movePaymentContainers();

      this.paymentEmitter.emit('braintreeInitComplete');
    },

    attachEventListeners(instance) {
      instance.on('changeActiveView', ({ newViewId, previousViewId }) => {
        this.removeActiveClass();

        this.clearErrorMessage();

        if (newViewId === 'methods') {
          this.paymentEmitter.emit('changePaymentMethodDisplay', { visible: false });
          previousViewId !== 'card' && this.startPayment();
        } else if (newViewId !== 'options') {
          this.addActiveClass(newViewId);
          const id = newViewId === 'card' ? 'braintree' : `braintree_${newViewId}`;
          this.paymentEmitter.emit('paymentMethodSelected', { id });

          if (newViewId === 'card') {
            this.saveVaultLocation = '.braintree-form__flexible-fields';
          } else if (newViewId === 'paypal' && this.paypal.vaultActive) {
            this.saveVaultLocation = 'div[data-braintree-id="paypal-button"]';
          } else if (newViewId === 'googlePay' && this.google.vaultActive) {
            this.saveVaultLocation = 'div[data-braintree-id="google-pay-button"]';
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
      this.paymentEmitter.on('changePaymentMethodDisplay', this.changePaymentMethodDisplay);
      this.paymentEmitter.on('braintreeStoredPaymentCardSelected', this.clearSelectedPaymentMethod);
      this.paymentEmitter.on('braintreePaymentStart', this.showLoader);
      this.paymentEmitter.on('braintreePaymentError', this.hideLoader);
    },

    clearSelectedMethod({ id }) {
      this.unselectVaultedMethods();
      if (!id.startsWith('braintree') || id === 'braintree-lpm' || id === 'braintree-vaulted') {
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
        }
      });
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
@import "@/components/Braintree/DropIn/NewMethods/styles.scss";
</style>
