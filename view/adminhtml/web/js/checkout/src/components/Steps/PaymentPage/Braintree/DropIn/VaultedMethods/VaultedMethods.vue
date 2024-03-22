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
          @click="selectPaymentCard(vaultedMethod)"
        >
          <Tick
            v-if="vaultedMethod.selected"
            class="braintree-payment__payment-method-tick"
          />
          <TextField
            v-else
            class="braintree-payment__payment-method-select"
            :text="$t('paymentCard.select')"
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
              />
            </svg>
          </span>
          <span class="braintree-payment__payment-method__card-number">{{ $t('paymentCard.cardNumber') }}</span>
          <span class="braintree-payment__payment-method__name">
            **** **** **** {{ vaultedMethod.details.maskedCC }}
          </span>
          <span class="braintree-payment__payment-method__expiry-label">{{ $t('paymentCard.expiry') }}</span>
          <span class="braintree-payment__payment-method__expiry">
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
      <Agreements id="braintreeVault" />
      <PrivacyPolicy />
      <MyButton
        class="braintree-vaulted-methods-pay-button"
        label="Pay"
        primary
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

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
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
  name: 'BraintreeNewMethods',
  components: {
    Agreements,
    MyButton,
    PrivacyPolicy,
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
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'websiteName']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'getSelectedBillingAddress', 'isLoggedIn']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'availableMethods']),
  },
  async created() {
    await this.getStoreConfig();
    await this.getPaymentMethods();
    await this.getBraintreeConfig();
    await this.getVaultedMethods();

    this.paymentStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    this.paymentEmitter.on('braintreePaymentStart', () => { this.loading = true; });
    this.paymentEmitter.on('braintreePaymentError', () => { this.loading = false; });
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'getBraintreeConfig',
      'createClientToken',
      'getVaultedMethods',
      'selectVaultedMethod',
      'setErrorMessage',
      'clearErrorMessage',
      'escapeNonAsciiCharacters',
      'mapCartTypes',
    ]),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(usePaymentStore, ['getPaymentMethods']),

    async selectPaymentCard(vaultedMethod) {
      // If the method is the same as the one already selected then we can return early.
      if (this.selectedVaultMethod && vaultedMethod.publicHash === this.selectedVaultMethod.publicHash) {
        return;
      }

      this.paymentEmitter.emit('paymentMethodSelected', { id: 'braintree-vaulted' });

      // Remove any existing hosted fields if they exist.
      if (this.hostedFieldsInstance) {
        this.hostedFieldsInstance.teardown();
      }

      this.clearErrorMessage();
      this.selectVaultedMethod(vaultedMethod);
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

        if (!this.threeDSEnabled || this.vaultVerifyCvv || price < threshold) {
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
      })).then((response) => {
        const paymentData = this.getPaymentData(response);

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
