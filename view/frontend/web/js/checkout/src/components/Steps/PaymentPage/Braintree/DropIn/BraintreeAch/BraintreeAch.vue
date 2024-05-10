<template>
  <teleport
    v-if="achLocation"
    :to="achLocation"
  >
    <div
      v-if="!loading && clientInstance"
      class="braintree-form braintree-sheet"
      :style="{
        '--braintree-method-position': getPaymentPriority('braintree_ach_direct_debit') + 1
      }"
    >
      <div
        data-braintree-id="ach"
        class="braintree-ach braintree-sheet"
        data-cy="braintree-ach-trigger"
        @click="selectMethod"
        @keydown="selectMethod"
      >
        <div
          class="braintree-option braintree-option__ach"
          :class="{'braintree-option__selected': selectedMethod === 'braintree-ach'}"
          tabindex="0"
          role="button"
        >
          <div class="braintree-option__logo">
            <svg
              width="48"
              height="29"
              class=""
            >
              <use xlink:href="#logoAch"
                data-cy="braintree-ach-logo"
              />
            </svg>
          </div>
          <div
            class="braintree-option__label"
            :aria-label="$t('braintree.ach.payment')"
            data-cy="braintree-ach-title"
          >
            {{ $t('braintree.ach.payment') }}
            <div class="braintree-option__disabled-message" />
          </div>
        </div>
      </div>
      <div
        v-show="selectedMethod === 'braintree-ach'"
        class="braintree-ach-container"
      >
        <TextInput
          v-model="routingNumber"
          name="routing-number"
          :placeholder="$t('braintree.ach.routingNumber')"
          autocomplete="off"
          :data-cy="'braintree-ach-routing-number-input'"
        />
        <TextInput
          v-model="accountNumber"
          name="account-number"
          :placeholder="$t('braintree.ach.accountNumber')"
          autocomplete="off"
          :data-cy="'braintree-ach-account-number-input'"
        />
        <SelectInput
          v-model="accountType"
          :options="getAccountTypeOptions()"
          :label="$t('braintree.ach.accountType')"
          :data-cy="'braintree-ach-account-type-select'"
        />
        <SelectInput
          v-model="ownershipType"
          :options="getOwnershipTypeOptions()"
          :label="$t('braintree.ach.ownershipType')"
          :data-cy="'braintree-ach-ownership-type-select'"
        />
        <TextInput
          v-if="ownershipType === 'personal'"
          v-model="firstname"
          name="firstname"
          :placeholder="$t('braintree.ach.firstname')"
          autocomplete="off"
          :data-cy="'braintree-ach-firstname-input'"
        />
        <TextInput
          v-if="ownershipType === 'personal'"
          v-model="lastname"
          name="lastname"
          :placeholder="$t('braintree.ach.lastname')"
          autocomplete="off"
          :data-cy="'braintree-ach-lastname-input'"
        />
        <TextInput
          v-if="ownershipType === 'business'"
          v-model="businessName"
          class="braintree-ach-business-name"
          name="business-name"
          :placeholder="$t('braintree.ach.businessName')"
          autocomplete="off"
          :data-cy="'braintree-ach-business-name-input'"
        />
        <div class="braintree-ach-mandate">
          <ErrorMessage
            v-if="errorMessage"
            :message="errorMessage"
            :attached="false"
          />
          <CheckboxComponent
            :checked="achMandate"
            :change-handler="({ currentTarget }) => achMandate = currentTarget.checked"
            :text="$t('braintree.ach.proof')"
            :data-cy="'braintree-ach-proof-checkbox'"
          />
          <TextField
            :text="$t('braintree.ach.terms', { websiteName })"
            :data-cy="'braintree-ach-terms-text'"
          />
          <Agreements id="braintreeAch" />
          <Recaptcha
            v-if="isRecaptchaVisible('placeOrder')"
            id="placeOrder"
            location="braintreeAch"
          />
          <PrivacyPolicy />
          <MyButton
            label="Pay"
            primary
            :data-cy="'braintree-ach-pay-button'"
            @click="startPayment()"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
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
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import SelectInput from '@/components/Core/ActionComponents/Inputs/Select/Select.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';

// Helpers
import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

// Services
import createPayment from '@/services/payments/createPaymentRest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// External
import braintree from 'braintree-web';

export default {
  name: 'BraintreeAch',
  components: {
    Agreements,
    CheckboxComponent,
    ErrorMessage,
    MyButton,
    PrivacyPolicy,
    Recaptcha,
    SelectInput,
    TextField,
    TextInput,
  },
  data() {
    return {
      loading: false,
      selectedMethod: null,
      routingNumber: '',
      accountNumber: '',
      accountType: 'checking',
      ownershipType: 'personal',
      firstname: '',
      lastname: '',
      businessName: '',
      achMandate: false,
      usBankAccount: null,
      achLocation: null,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'ach',
      'clientInstance',
      'errorMessage',
      'merchantAccountId',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'websiteName']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'selected']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'getPaymentPriority']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
  },
  async created() {
    await this.getInitialConfig();
    await this.createClientToken();

    if (this.clientInstance) {
      this.createInstance();
    } else {
      const braintreeStore = useBraintreeStore();
      braintreeStore.$subscribe((mutation) => {
        if (mutation.payload && 'clientInstance' in mutation.payload) {
          this.createInstance();
        }
      });
    }

    this.paymentEmitter.on('braintreePaymentStart', () => { this.loading = true; });
    this.paymentEmitter.on('braintreePaymentError', () => { this.loading = false; });
    this.paymentEmitter.on('braintreeInitComplete', () => { this.achLocation = '.braintree-sheet__container'; });
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      this.selectedMethod = id;
    });
  },
  watch: {
    routingNumber() {
      if (this.errorMessage) {
        this.clearErrorMessage();
      }
    },
    accountNumber() {
      if (this.errorMessage) {
        this.clearErrorMessage();
      }
    },
    firstname() {
      if (this.errorMessage) {
        this.clearErrorMessage();
      }
    },
    lastname() {
      if (this.errorMessage) {
        this.clearErrorMessage();
      }
    },
    businessName() {
      if (this.errorMessage) {
        this.clearErrorMessage();
      }
    },
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'createClientToken',
      'setErrorMessage',
      'clearErrorMessage',
    ]),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useRecaptchaStore, ['validateToken']),

    selectMethod() {
      this.paymentEmitter.emit('paymentMethodSelected', { id: 'braintree-ach' });
    },

    async createInstance() {
      const options = {
        client: this.clientInstance,
      };

      this.usBankAccount = await braintree.usBankAccount.create(options);
    },

    getAccountTypeOptions() {
      return [
        {
          option: {
            name: 'Checking',
            value: 'checking',
          },
        },
        {
          option: {
            name: 'Savings',
            value: 'savings',
          },
        },
      ];
    },

    getOwnershipTypeOptions() {
      return [
        {
          option: {
            name: 'Personal',
            value: 'personal',
          },
        },
        {
          option: {
            name: 'Business',
            value: 'business',
          },
        },
      ];
    },

    async startPayment() {
      this.clearErrorMessage();
      this.paymentEmitter.emit('braintreePaymentStart');

      if (!this.achMandate) {
        this.setErrorMessage('You must accept proof of authorization.');
        this.paymentEmitter.emit('braintreePaymentError');
        return false;
      }

      if (!this.validateAgreements() || !this.validateToken('placeOrder')) {
        this.paymentEmitter.emit('braintreePaymentError');
        return false;
      }

      const mandateText = this.$t('braintree.achTerms', { websiteName: this.websiteName });

      const billingAddress = this.cart.billing_address;

      const bankDetails = {
        routingNumber: this.routingNumber,
        accountNumber: this.accountNumber,
        accountType: this.accountType,
        ownershipType: this.ownershipType,
        billingAddress: {
          streetAddress: billingAddress.street[0],
          extendedAddress: billingAddress.street[1],
          locality: billingAddress.city,
          region: billingAddress.region.code,
          postalCode: billingAddress.postcode,
        },
      };

      if (bankDetails.ownershipType === 'personal') {
        bankDetails.firstName = this.firstname;
        bankDetails.lastName = this.lastname;
      } else {
        bankDetails.businessName = this.businessName;
      }

      return this.usBankAccount
        .tokenize({
          bankDetails,
          mandateText,
        })
        .then(this.getPaymentData)
        .then(createPayment)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((paymentError) => {
          console.log(paymentError);
          this.setErrorMessage(paymentError?.response?.data?.message || paymentError.message);
          this.paymentEmitter.emit('braintreePaymentError');
        });
    },

    getPaymentData(payload) {
      const additionalPaymentData = getAdditionalPaymentData();

      return {
        email: this.customer.email,
        paymentMethod: {
          method: 'braintree_ach_direct_debit',
          additional_data: {
            payment_method_nonce: payload.nonce,
            ...additionalPaymentData,
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

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeAch/styles.scss";
</style>
