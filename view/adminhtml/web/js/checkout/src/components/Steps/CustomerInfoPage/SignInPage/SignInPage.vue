<template>
  <Loader v-if="loadingShippingMethods" />
  <div class="details-form">
    <div
      v-show="isExpressPaymentsVisible"
      class="details-form-header"
    >
      <div class="instantCheckout-block">
        <TextField :text="instantCheckoutText" />
      </div>
      <Recaptcha
        id="placeOrder"
        location="expressPayments"
      />
      <Agreements id="SignInPage" />
      <div class="instant-payment-buttons">
        <ErrorMessage
          v-if="errorMessage !== ''"
          :message="errorMessage"
          :attached="false"
        />
        <BraintreeGooglePay :key="`braintreeGooglePay-${storedKey}`" />
        <BraintreeApplePay :key="`braintreeApplePay-${storedKey}`" />
        <BraintreePayPal :key="`braintreePayPal-${storedKey}`" />
      </div>
    </div>
    <div class="details-form-body">
      <DividerComponent />
      <PayWith />
      <EmailAddress />
    </div>
  </div>
</template>
<script>
// icons
import { mapActions, mapState } from 'pinia';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import PayWith from '@/components/Steps/GlobalComponents/PayWithComponent/PayWith.vue';
import DividerComponent from '@/components/Steps/CustomerInfoPage/DividerComponent/DividerComponent.vue';
import EmailAddress from '@/components/Steps/CustomerInfoPage/EmailAddress/EmailAddress.vue';
import BraintreeGooglePay from '@/components/Steps/PaymentPage/Braintree/GooglePay/GooglePay.vue';
import BraintreeApplePay from '@/components/Steps/PaymentPage/Braintree/ApplePay/ApplePay.vue';
import BraintreePayPal from '@/components/Steps/PaymentPage/Braintree/PayPal/PayPal.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';

// Stores
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';
import formatPrice from '@/helpers/payment/formatPrice';
import continueToDeliveryDataLayer from '@/helpers/dataLayer/continueToDeliveryDataLayer';

export default {
  name: 'SignInComponent',
  components: {
    TextField,
    PayWith,
    DividerComponent,
    EmailAddress,
    BraintreeGooglePay,
    BraintreeApplePay,
    BraintreePayPal,
    ErrorMessage,
    Loader,
    Recaptcha,
    Agreements,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
  },
  data() {
    return {
      isAddressBlockVisible: true,
      isSavedAddressSelected: false,
      savedAddressID: null,
      customerInfoValidation: false,
      billingInfoValidation: false,
      addressFormErrorMessage: false,
      storedKey: 0,
      instantCheckoutText: '',
      instantCheckoutTextId: 'bluefinch-checkout-instantcheckout-text',
      proceedToPayText: '',
      proceedToPayTextId: 'bluefinch-checkout-proceedtopay-text',
      buttonEnabled: false,
      addressInfoWrong: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartEmitter', 'subtotalInclTax']),
    ...mapState(useConfigStore, ['addressFinder', 'custom', 'storeCode']),
    ...mapState(useCustomerStore, [
      'inputsSanitiseError',
      'customer',
      'isLoggedIn',
      'emailEntered',
      'selected',
      'isUsingSavedShippingAddress',
    ]),
    ...mapState(useShippingMethodsStore, ['isClickAndCollect', 'loadingShippingMethods']),
    ...mapState(usePaymentStore, ['errorMessage', 'isExpressPaymentsVisible']),
  },
  created() {
    this.cartEmitter.on('cartUpdated', async () => {
      this.storedKey += 1;
    });

    const customerStore = useCustomerStore();
    customerStore.$subscribe((mutation) => {
      if (mutation.type === 'direct' || (mutation.type === 'patch object'
          && mutation.payload.selected
          && mutation.payload.selected[this.address_type])) {
        this.updateButtonState();
      }
    }, { flush: 'sync' });
    this.updateButtonState();
  },
  async mounted() {
    await this.getInitialConfig();
    await this.getCart();

    const types = {
      shipping: 'customerInfoValidation',
      billing: 'billingInfoValidation',
    };

    this.instantCheckoutText = window.bluefinchCheckout?.[this.instantCheckoutTextId] || this.$t('instantCheckout');
    this.proceedToPayText = window.bluefinchCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');

    Object.keys(types).forEach((type) => {
      const first = this.validateNameField(type, 'First name', this.selected[type].firstname);
      const last = this.validateNameField(type, 'Last name', this.selected[type].lastname);
      const phone = this.validatePhone(type, this.selected[type].telephone);

      this[types[type]] = first && last && phone;
    });

    document.addEventListener(this.instantCheckoutTextId, this.setInstantCheckoutTextId);
    document.addEventListener(this.proceedToPayTextId, this.setProceedToPayTextId);
  },
  unmounted() {
    document.removeEventListener(this.instantCheckoutTextId, this.setInstantCheckoutTextId);
    document.removeEventListener(this.proceedToPayTextId, this.setProceedToPayTextId);
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, [
      'setAddressAsCustom',
      'setAddressAsEditing',
      'validateAddress',
      'addAddressError',
      'validateNameField',
      'validatePhone',
      'validatePostcode',
      'setAddressToStore',
    ]),
    ...mapActions(useShippingMethodsStore, [
      'clearShippingMethodCache',
      'setClickAndCollect',
      'setNotClickAndCollect',
      'setAddressesOnCart',
    ]),
    ...mapActions(useStepsStore, ['goToShipping', 'goToPayment']),
    updateButtonState() {
      const addressType = this.address_type;

      const areNamesValid = this.validateNameField(
        addressType,
        'First name',
        this.selected[addressType].firstname,
      ) && this.validateNameField(
        addressType,
        'Last name',
        this.selected[addressType].lastname,
      ) && this.validatePhone(
        addressType,
        this.selected[addressType].telephone,
      );

      const validAddress = this.validateAddress(addressType);
      const validPostcode = this.validatePostcode(this.address_type);

      this.buttonEnabled = !this.inputsSanitiseError && validAddress && validPostcode && areNamesValid;
    },
    async submitShippingOption() {
      this.requiredErrorMessage = '';

      const isValid = this.validateAddress(this.address_type, true) && this.validatePostcode(this.address_type, true);

      if (isValid) {
        if (this.savedAddressID === null
            || this.selected[this.address_type].id === null) {
          this.setAddressAsCustom(this.address_type);
        }

        this.setAddressAsEditing(this.address_type, false);

        // If the address type is shipping and the billing is set to use the same then update billing too.
        if (this.selected.billing.same_as_shipping) {
          const clonedAddress = deepClone(this.selected.shipping);
          this.setAddressToStore(clonedAddress, 'billing');
        }

        await this.setAddressesOnCart();
        this.goToShipping();
        continueToDeliveryDataLayer();
      } else {
        const fieldErrors = this.selected.formErrors[this.address_type];
        Object.entries(fieldErrors).forEach(([value]) => {
          this.addAddressError(this.address_type, value);
        });
        this.requiredErrorMessage = this.selected.formErrors.message[this.address_type];
        this.addressInfoWrong = true;
      }
    },

    async submitBillingInfo() {
      await this.setAddressesOnCart();

      this.goToPayment();
    },

    editAddress() {
      this.setAddressAsEditing(this.address_type, true);
      this.setAddressAsCustom(this.address_type);
    },
    showAddressBlock(value) {
      this.isAddressBlockVisible = value;
    },
    passSelectedItemId(value) {
      this.savedAddressID = value;
      if (value !== null) {
        this.buttonEnabled = true;
      }
    },
    selectedSavedAddress(value) {
      this.isSavedAddressSelected = value;
    },
    isCustomerInfoFull(value) {
      this.customerInfoValidation = value;
    },
    billingInfoFull(value) {
      this.billingInfoValidation = value;
    },
    formatPrice(price) {
      return formatPrice(price);
    },
    setInstantCheckoutTextId(event) {
      this.instantCheckoutText = event?.detail?.value || this.$t('instantCheckout');
    },
    setProceedToPayTextId(event) {
      this.proceedToPayText = event?.detail?.value || this.$t('shippingStep.proceedToPay');
    },
  },
};
</script>
  <style lang="scss" scoped>
  @import "@/components/Steps/CustomerInfoPage/DetailsPage/styles.scss";
  </style>
