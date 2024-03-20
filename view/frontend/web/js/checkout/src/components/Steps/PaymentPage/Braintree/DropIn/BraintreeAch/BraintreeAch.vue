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
              <use xlink:href="#logoAch" />
            </svg>
          </div>
          <div
            class="braintree-option__label"
            :aria-label="$t('braintree.ach.payment')"
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
        />
        <TextInput
          v-model="accountNumber"
          name="account-number"
          :placeholder="$t('braintree.ach.accountNumber')"
          autocomplete="off"
        />
        <SelectInput
          v-model="accountType"
          :options="getAccountTypeOptions()"
          :label="$t('braintree.ach.accountType')"
        />
        <SelectInput
          v-model="ownershipType"
          :options="getOwnershipTypeOptions()"
          :label="$t('braintree.ach.ownershipType')"
        />
        <TextInput
          v-if="ownershipType === 'personal'"
          v-model="firstname"
          name="firstname"
          :placeholder="$t('braintree.ach.firstname')"
          autocomplete="off"
        />
        <TextInput
          v-if="ownershipType === 'personal'"
          v-model="lastname"
          name="lastname"
          :placeholder="$t('braintree.ach.lastname')"
          autocomplete="off"
        />
        <TextInput
          v-if="ownershipType === 'business'"
          v-model="businessName"
          class="braintree-ach-business-name"
          name="business-name"
          :placeholder="$t('braintree.ach.businessName')"
          autocomplete="off"
        />
        <div class="braintree-ach-mandate">
          <CheckboxComponent
            :checked="achMandate"
            :change-handler="({ currentTarget }) => achMandate = currentTarget.checked"
            :text="$t('braintree.ach.proof')"
          />
          <TextField :text="$t('braintree.ach.terms', { websiteName })" />
          <Agreements />
          <PrivacyPolicy />
          <MyButton
            label="Pay"
            primary
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
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
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
    MyButton,
    PrivacyPolicy,
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
      'merchantAccountId',
      'clientInstance',
      'ach',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'websiteName']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'isItemRequiringDelivery']),
    ...mapState(useCustomerStore, ['customer', 'selected']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'getPaymentPriority']),
  },
  async created() {
    await this.getStoreConfig();
    await this.getPaymentMethods();
    await this.getBraintreeConfig();
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

  methods: {
    ...mapActions(useBraintreeStore, [
      'getBraintreeConfig',
      'createClientToken',
      'setErrorMessage',
      'clearErrorMessage',
    ]),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(usePaymentStore, ['getPaymentMethods']),

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
