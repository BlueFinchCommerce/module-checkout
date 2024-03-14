<template>
  <Loader v-if="loadingShippingMethods" />
  <div class="details-form">
    <div class="details-form-header">
      <div class="instantCheckout-block" v-show="isExpressPaymentsVisible">
        <TextField :text="instantCheckoutText" />
      </div>
      <div class="instant-payment-buttons">
        <ErrorMessage
          v-if="errorMessage !== ''"
          :message="errorMessage"
        />
        <BraintreeGooglePay @expressPaymentsLoad="expressPaymentsVisible" :key="`braintreeGooglePay-${storedKey}`" />
        <BraintreeApplePay @expressPaymentsLoad="expressPaymentsVisible" :key="`braintreeApplePay-${storedKey}`" />
        <BraintreePayPal @expressPaymentsLoad="expressPaymentsVisible" :key="`braintreePayPal-${storedKey}`" />
        <AdyenGooglePay @expressPaymentsLoad="expressPaymentsVisible" :key="`adyenGooglePay-${storedKey}`" />
        <AdyenApplePay @expressPaymentsLoad="expressPaymentsVisible" :key="`adyenApplePay-${storedKey}`" />
      </div>
    </div>
    <div class="details-form-body">
      <DividerComponent />
      <PayWith :is-express-payments-visible="isExpressPaymentsVisible" />

      <ProgressBar v-if="emailEntered"/>

      <EmailAddress />

      <Newsletter v-if="emailEntered && !customer.id" />

      <div
        v-if="custom.clickandcollectEnabled && emailEntered && isItemRequiringDelivery"
        class="shipping-type-toggle"
      >
        <MyButton
          :label="$t('yourDetailsSection.deliverySection.shippingButton')"
          :primary="!isClickAndCollect"
          :tertiary="isClickAndCollect"
          @click="setNotClickAndCollect()"
        />
        <MyButton
          :label="$t('yourDetailsSection.deliverySection.clickandCollectButton')"
          :tertiary="!isClickAndCollect"
          :primary="isClickAndCollect"
          @click="setClickAndCollect()"
        />
      </div>

      <div v-if="emailEntered && isClickAndCollect">
        <ClickAndCollect
          v-if="subtotalInclTax >= custom.clickandcollectMin && subtotalInclTax <= custom.clickandcollectMax"
        />
        <TextField
          v-else-if="subtotalInclTax < custom.clickandcollectMin"
          class="click-and-collect-unavilable"
          :text="$t('yourDetailsSection.deliverySection.clickandCollectThresholdLow',
                    { price: formatPrice(custom.clickandcollectMin) })"
        />
        <TextField
          v-else
          class="click-and-collect-unavilable"
          :text="$t('yourDetailsSection.deliverySection.clickandCollectThresholdHigh',
                    { price: formatPrice(custom.clickandcollectMax) })"
        />
      </div>

      <AddressList
        v-if="emailEntered && customer.addresses.length && !isClickAndCollect && isItemRequiringDelivery"
        address-type="shipping"
        @showAddressBlock="showAddressBlock"
        @passSelectedItemId = "passSelectedItemId"
        @selectedSavedAddress="selectedSavedAddress"
      />

      <div
        v-if="emailEntered && (!selected[address_type].id
          || (selected[address_type].id === 'custom' && selected[address_type].editing))
          && !isClickAndCollect && isItemRequiringDelivery"
        class="additional-detail-form"
      >
        <div
          class="delivery-section"
        >
          <div v-if="customer.addresses.length <= 0"
            class="details-form-title">
            <YourDetails fill="black" />
            <TextField
              :text="$t('yourDetailsSection.title')"
            />
            <div class="divider-line"></div>
          </div>
          <div v-else class="details-form-title saved-address">
            <Locate />
            <TextField
              class="address-block__title"
              :text="$t('yourDetailsSection.deliverySection.newAddressTitle')"
            />
            <div class="divider-line"></div>
          </div>

          <NameFields
            :address_type="address_type"
            @isCustomerInfoFull="isCustomerInfoFull"
          />
          <div
            v-if="isAddressBlockVisible"
            class="delivery-section-title"
          >
            <Locate />
            <div class="delivery-section-title-text">
              <TextField
                :text="$t('yourDetailsSection.deliverySection.title')"
              />
            </div>
            <div class="divider-line"></div>
          </div>

          <div>
            <div>
              <AddressFinder
                v-if="!selected[address_type].id
                  || (selected[address_type].id === 'custom' && selected[address_type].editing)"
              />
            </div>
          </div>

          <ShippingForm v-if="selected[address_type].editing || !addressFinder.enabled" />

          <LinkComponent
            v-if="!selected[address_type].id
              && !selected[address_type].editing && address_type === 'shipping'
              && addressFinder.enabled"
            class="manually-button"
            :label="$t('yourDetailsSection.deliverySection.addressForm.linkText')"
            @click.prevent="editAddress"
          />
        </div>
      </div>

      <div
        v-if="emailEntered && !selected[address_type].editing
          && !isSavedAddressSelected
          && selected[address_type].id
          && !isUsingSavedShippingAddress
          && !isClickAndCollect
          && isItemRequiringDelivery"
        class="address-block"
        :class="customer.addresses.length > 0 ? 'saved-address-active' : ''"
      >
        <TextField
          class="address-block__title selected"
          :text="$t('yourDetailsSection.deliverySection.deliveryAddressTitle')"
        />
        <div class="address-block__item">
          <article>
            <AddressBlock
              :address_type="`shipping`"
              :address="selected[address_type]"
            />
          </article>
        </div>
        <div
          v-if="selected[address_type].id"
          class="address-block__edit"
          @click.prevent="editAddress"
          @keydown.enter.prevent="editAddress"
          tabindex="0"
        >
          <Edit />
        </div>
      </div>

      <div class="address-form-error-message">
        <ErrorMessage
          v-if="!customerInfoValidation && addressFormErrorMessage"
          :message="$t('errorMessages.addressFormErrorMessage')"
        />
      </div>

      <BillingForm
        v-if="emailEntered && !isClickAndCollect"
        @billingInfoFull="billingInfoFull"
      />

      <MyButton
        v-if="emailEntered && !selected.billing.editing && !isClickAndCollect && isItemRequiringDelivery"
        type="submit"
        primary
        :label="$t('yourDetailsSection.deliverySection.toShippingButton')"
        :disabled="!buttonEnabled || (!customer.id && !customerInfoValidation)"
        @click="submitShippingOption();"
      />
      <MyButton
        v-if="emailEntered && !selected.billing.editing && !isClickAndCollect && !isItemRequiringDelivery"
        type="submit"
        primary
        :label="proceedToPayText"
        :disabled="!selected.billing.id || (!customer.id && !billingInfoValidation)"
        @click="goToPayment();"
      />
    </div>
  </div>
</template>
<script>
// icons
import Locate from '@/components/Core/Icons/Locate/Locate.vue';
import YourDetails from '@/components/Core/Icons/YourDetails/YourDetails.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import PayWith from '@/components/Steps/PayWithComponent/PayWith.vue';
import DividerComponent from '@/components/Steps/DividerComponent/DividerComponent.vue';
import AddressFinder from '@/components/Steps/AddressFinder/AddressFinder.vue';
import NameFields from '@/components/Steps/Addresses/AddressForms/Form/Name/Name.vue';
import ShippingForm from '@/components/Steps/Addresses/AddressForms/ShippingForm/ShippingForm.vue';
import AddressBlock from '@/components/Steps/Addresses/AddressBlock/AddressBlock.vue';
import EmailAddress from '@/components/Steps/EmailAddress/EmailAddress.vue';
import LinkComponent from '@/components/Core/Link/Link.vue';
import AddressList from '@/components/Steps/Addresses/AddressList/AddressList.vue';
import BraintreeGooglePay from '@/components/Braintree/GooglePay/GooglePay.vue';
import BraintreeApplePay from '@/components/Braintree/ApplePay/ApplePay.vue';
import BraintreePayPal from '@/components/Braintree/PayPal/PayPal.vue';
import AdyenGooglePay from '@/components/Adyen/GooglePay/GooglePay.vue';
import AdyenApplePay from '@/components/Adyen/ApplePay/ApplePay.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import BillingForm from '@/components/Steps/Addresses/AddressForms/BillingForm/BillingForm.vue';
import Newsletter from '@/components/Core/Newsletter/Newsletter.vue';
import MyButton from '@/components/Core/Button/Button.vue';
import ClickAndCollect from '@/components/Steps/Addresses/ClickAndCollect/ClickAndCollect.vue';
import Loader from '@/components/Core/Loader/Loader.vue';
import ProgressBar from '@/components/Steps/ProgressBar/ProgressBar.vue';

// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

// Helpers
import deepClone from '@/helpers/deepClone';
import formatPrice from '@/helpers/formatPrice';

export default {
  name: 'YourDetailComponent',
  components: {
    TextField,
    PayWith,
    YourDetails,
    DividerComponent,
    Locate,
    AddressFinder,
    NameFields,
    ShippingForm,
    AddressBlock,
    Edit,
    EmailAddress,
    LinkComponent,
    AddressList,
    BraintreeGooglePay,
    BraintreeApplePay,
    BraintreePayPal,
    AdyenGooglePay,
    AdyenApplePay,
    ErrorMessage,
    BillingForm,
    Newsletter,
    MyButton,
    ClickAndCollect,
    Loader,
    ProgressBar,
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
      isExpressPaymentsVisible: true,
      instantCheckoutText: '',
      instantCheckoutTextId: 'gene-bettercheckout-instantcheckout-text',
      proceedToPayText: '',
      proceedToPayTextId: 'gene-bettercheckout-proceedtopay-text',
      buttonEnabled: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cartEmitter', 'subtotalInclTax', 'isItemRequiringDelivery']),
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
    ...mapState(usePaymentStore, ['errorMessage']),
  },
  created() {
    this.cartEmitter.on('cartUpdated', async () => {
      this.clearPaymentReponseCache();
      // await this.getPaymentMethodsResponse();
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
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    const types = {
      shipping: 'customerInfoValidation',
      billing: 'billingInfoValidation',
    };

    this.instantCheckoutText = window.geneCheckout?.[this.instantCheckoutTextId] || this.$t('instantCheckout');
    this.proceedToPayText = window.geneCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');

    Object.keys(types).forEach((type) => {
      const first = this.validateNameField(type, 'First name', this.selected[type].firstname);
      const last = this.validateNameField(type, 'Last name', this.selected[type].lastname);
      const phone = this.validatePhone(type, this.selected[type].telephone);

      this[types[type]] = first && last && phone;
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, [
      'setAddressAsCustom',
      'setAddressAsEditing',
      'validateAddress',
      'validateNameField',
      'validatePhone',
      'validatePostcode',
      'setAddressToStore',
    ]),
    ...mapActions(useAdyenStore, ['getPaymentMethodsResponse', 'clearPaymentReponseCache']),
    ...mapActions(useShippingMethodsStore, [
      'clearShippingMethodCache',
      'setClickAndCollect',
      'setNotClickAndCollect',
      'setShippingAddressesOnCart',
    ]),
    ...mapActions(useStepsStore, ['goToShipping', 'goToPayment']),
    expressPaymentsVisible(value) {
      this.isExpressPaymentsVisible = value;
    },
    updateButtonState() {
      const addressType = this.address_type;

      // If we're on shipping then names are valid in this scenario.
      // If we're on billing then validate the name fields.
      const areNamesValid = addressType !== 'billing'
        || (
          this.validateNameField(
            addressType,
            'First name',
            this.selected[addressType].firstname,
          ) && this.validateNameField(
            addressType,
            'Last name',
            this.selected[addressType].firstname,
          ) && this.validatePhone(
            addressType,
            this.selected[addressType].telephone,
          )
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

        await this.setShippingAddressesOnCart();
        this.goToShipping();
      } else {
        const fieldErrors = this.selected.formErrors[this.address_type];
        Object.entries(fieldErrors).forEach(([value]) => {
          this.addAddressError(this.address_type, value);
        });
        this.requiredErrorMessage = this.selected.formErrors.message[this.address_type];
      }
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
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/Steps/DetailsPage/styles.scss";
</style>
