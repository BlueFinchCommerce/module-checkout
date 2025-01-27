<template>
  <div
    v-if="Object.values(vaultedMethods).length"
    class="braintree-vault"
  >
    <div
      v-show="!loading && clientInstance"
      class="braintree-vaulted-methods-container"
      :class="`braintree-vaulted-methods-container-${Object.values(vaultedMethods).length}`"
    >
      <div
        v-for="vaultedMethod in Object.values(vaultedMethods)"
        :key="vaultedMethod.publicHash"
      >
        <button
          class="braintree-payment__payment-method__header__title button"
          :class="{ 'braintree-payment__payment-method-disabled': !vaultedMethod.selected }"
          :aria-label="$t('paymentCard.storedPaymentLabel', { lastFour: vaultedMethod.details.maskedCC })"
          type="button"
          data-cy="braintree-saved-payment-card-button"
          @click="selectPaymentCard(vaultedMethod)"
        >
          <Tick
            v-if="vaultedMethod.selected"
            class="braintree-payment__payment-method-tick"
            :data-cy="'braintree-saved-payment-card-active-icon'"
          />
          <TextField
            v-else
            class="braintree-payment__payment-method-select"
            :text="$t('paymentCard.select')"
            :data-cy="'braintree-saved-payment-card-select-text'"
          />
          <span
            class="braintree-payment__payment-method__radio"
            aria-hidden="true"
          />
          <span
            class="braintree-payment__payment-method__image__wrapper
          braintree-payment__payment-method__image__wrapper--outline"
          >
            <svg>
              <use
                data-braintree-id="card-number-icon-svg"
                :xlink:href="`#icon-${mapCartTypes(vaultedMethod.details.type)}`"
                :data-cy="`braintree-saved-payment-card-${mapCartTypes(vaultedMethod.details.type)}-icon`"
              />
            </svg>
          </span>
          <span
            class="braintree-payment__payment-method__card-number"
            data-cy="braintree-saved-payment-card-text"
          >
            {{ $t('paymentCard.cardNumber') }}
          </span>
          <span
            class="braintree-payment__payment-method__name"
            data-cy="braintree-saved-payment-card-text-number"
          >
            **** **** **** {{ vaultedMethod.details.maskedCC }}
          </span>
          <span
            class="braintree-payment__payment-method__expiry-label"
            data-cy="braintree-saved-payment-card-expiry-text"
          >
            {{ $t('paymentCard.expiry') }}
          </span>
          <span
            class="braintree-payment__payment-method__expiry"
            data-cy="braintree-saved-payment-card-expiry-date"
          >
            {{ vaultedMethod.details.expirationDate }}
          </span>
        </button>
      </div>
    </div>
    <div
      v-if="vaultVerifyCvv && selectedVaultMethod"
      v-show="!loading"
      :id="'cid_' + selectedVaultMethod.publicHash"
    />
    <template v-if="selectedVaultMethod && !loading">
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
        :attached="false"
      />
      <Agreements id="braintreeVault" />
      <PrivacyPolicy />
      <Recaptcha
        v-if="isRecaptchaVisible('placeOrder')"
        id="placeOrder"
        location="braintreeVaultedMethods"
      />
      <MyButton
        class="braintree-vaulted-methods-pay-button"
        label="Pay"
        primary
        :data-cy="'braintree-saved-payment-card-pay-button'"
        @click="startPayment()"
      />
    </template>
  </div>
</template>

<script>
import { markRaw } from 'vue';

// Stores
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
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Tick from '@/components/Core/Icons/Tick/Tick.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Helpers
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';

// Services
import createPayment from '@/services/payments/createPaymentRest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import getPaymentNonce from '@/services/braintree/getPaymentNonce';
import updatePayment from '@/services/braintree/updatePayment';

// External
import braintree from 'braintree-web';

export default {
  name: 'BrainteeVaultMethods',
  components: {
    Agreements,
    ErrorMessage,
    MyButton,
    PrivacyPolicy,
    Recaptcha,
    Tick,
    TextField,
  },
  data() {
    return {
      hostedFieldsInstance: null,
      loading: false,
      paymentStepText: '',
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'vaultActive',
      'clientToken',
      'clientInstance',
      'threeDSecureInstance',
      'vaultedMethods',
      'selectedVaultMethod',
      'vaultVerifyCvv',
      'threeDSEnabled',
      'threeDSThresholdAmount',
      'alwaysRequestThreeDS',
      'errorMessage',
      'unselectVaultedMethods',
    ]),
    ...mapState(useConfigStore, ['locale', 'currencyCode', 'websiteName']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'getSelectedBillingAddress', 'isLoggedIn']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'availableMethods', 'selectedMethod']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }

    this.paymentStepText = window.bluefinchCheckout?.['bluefinch-checkout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    this.paymentEmitter.on('braintreePaymentStart', () => { this.loading = true; });
    this.paymentEmitter.on('braintreePaymentError', () => { this.loading = false; });
  },
  watch: {
    selectedMethod: {
      handler(newVal) {
        if (newVal !== null && newVal !== 'braintree-vaulted') {
          this.unselectVaultedMethods();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'createClientToken',
      'selectVaultedMethod',
      'setErrorMessage',
      'clearErrorMessage',
      'escapeNonAsciiCharacters',
      'mapCartTypes',
    ]),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['validateToken']),
    ...mapActions(usePaymentStore, ['selectPaymentMethod']),

    async selectPaymentCard(vaultedMethod) {
      // If the method is the same as the one already selected then we can return early.
      if (this.selectedVaultMethod && vaultedMethod.publicHash === this.selectedVaultMethod.publicHash) {
        return;
      }

      this.clearErrorMessage();
      await this.selectVaultedMethod(vaultedMethod);
      this.selectPaymentMethod('braintree-vaulted');
      this.paymentEmitter.emit('braintreeStoredPaymentCardSelected', { publicHash: vaultedMethod.publicHash });

      if (this.vaultVerifyCvv) {
        const options = {
          client: this.clientInstance,
          fields: {
            cvv: {
              selector: `#cid_${vaultedMethod.publicHash}`,
              placeholder: '123',
            },
          },
        };

        this.hostedFieldsInstance = await markRaw(braintree.hostedFields.create(options));
      }
    },

    startPayment() {
      this.clearErrorMessage();

      if (!this.validateAgreements()) {
        return;
      }

      this.paymentEmitter.emit('braintreePaymentStart');

      const { publicHash } = this.selectedVaultMethod;
      const getNonce = !this.hostedFieldsInstance
        ? getPaymentNonce(publicHash)
        : this.hostedFieldsInstance
          .tokenize()
          .then(async (response) => {
            await updatePayment(response, publicHash);
            return getPaymentNonce(publicHash);
          });

      getNonce.then(({ nonce, bin }) => new Promise((resolve, reject) => {
        const price = this.cartGrandTotal / 100;
        const threshold = this.threeDSThresholdAmount;

        if (!this.threeDSEnabled || price < threshold) {
          resolve({
            nonce,
          });
          return;
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

        const threeDSecureParameters = {
          amount: parseFloat(price).toFixed(2),
          email: this.customer.email,
          nonce,
          bin,
          billingAddress: formattedBillingAddress,
          challengeRequested: this.alwaysRequestThreeDS,
        };

        this.threeDSecureInstance.on('lookup-complete', (data, next) => {
          next();
        });

        this.threeDSecureInstance.verifyCard(threeDSecureParameters, (err, response) => {
          if (err) {
            if (err.code === 'THREEDS_LOOKUP_VALIDATION_ERROR') {
              const errorMessage = err.details.originalError.details.originalError.error.message;
              const pleaseTryAgain = 'Please update the address and try again.';
              if (errorMessage === 'Billing line1 format is invalid.' && billingAddress.street.length > 50) {
                return reject(
                  new Error(`Billing line1 must be string and less than 50 characters. ${pleaseTryAgain}`),
                );
              } if (errorMessage === 'Billing line2 format is invalid.' && billingAddress.street.length.length > 50) {
                return reject(
                  new Error(`Billing line2 must be string and less than 50 characters. ${pleaseTryAgain}`),
                );
              }
              return reject(new Error(errorMessage));
            }
            return reject(new Error('Please try again with another form of payment.'));
          }

          const liability = {
            shifted: response.liabilityShifted,
            shiftPossible: response.liabilityShiftPossible,
          };

          if (liability.shifted || (!liability.shifted && !liability.shiftPossible)) {
            resolve(response);
          } else {
            reject(new Error('Please try again with another form of payment.'));
          }

          return true;
        });
      })).then(async (response) => {
        const paymentData = this.getPaymentData(response);

        const recaptchaValid = await this.validateToken('braintree');

        if (!recaptchaValid) {
          throw new Error(this.$t('ReCaptcha validation failed, please try again.'));
        }

        return createPayment(paymentData)
          .then(() => refreshCustomerData(['cart']))
          .then(this.redirectToSuccess);
      }).catch((paymentError) => {
        if (paymentError.name !== 'DropinError') {
          this.setErrorMessage(paymentError?.response?.data?.message || paymentError.message);
        }

        this.loading = false;
        this.paymentEmitter.emit('braintreePaymentError');
      });
    },

    getPaymentData(response) {
      const { publicHash } = this.selectedVaultMethod;

      return {
        paymentMethod: {
          method: 'braintree_cc_vault',
          additional_data: {
            payment_method_nonce: response.nonce,
            public_hash: publicHash,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },
  },
};
</script>

<style lang="scss">
@import "@/components/Steps/PaymentPage/Braintree/DropIn/VaultedMethods/styles.scss";
</style>
