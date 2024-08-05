<template>
  <div class="details-form">
    <div class="details-form-header"
         v-show="isExpressPaymentsVisible">
      <div class="instantCheckout-block">
        <TextField
          :text="instantCheckoutText"
          :data-cy="'instant-checkout-title'"
        />
      </div>
      <Agreements id="detailsPage"/>
      <Recaptcha
        id="placeOrder"
        location="expressPayments"
      />
      <div class="instant-payment-buttons">
        <ErrorMessage
          v-if="errorMessage !== ''"
          :message="errorMessage"
          :attached="false"
          :margin="false"
        />
        <BraintreeGooglePay
          v-if="isPaymentMethodAvailable('braintree_googlepay')"
          :key="`braintreeGooglePay-${storedKey}`"
        />
        <BraintreeApplePay
          v-if="isPaymentMethodAvailable('braintree_applepay')"
          :key="`braintreeApplePay-${storedKey}`"
        />
        <BraintreePayPal
          v-if="isPaymentMethodAvailable('braintree_paypal')"
          :key="`braintreePayPal-${storedKey}`"
        />
        <BraintreePayPal
          v-if="isPaymentMethodAvailable('braintree_paypal')"
          :key="`braintreePayPal-${storedKey}-credit`"
          :isCredit="paypal.creditActive"
        />
        <AdyenGooglePay
          v-if="isPaymentMethodAvailable('adyen_hpp')"
          :key="`adyenGooglePay-${storedKey}`"
        />
        <AdyenApplePay
          v-if="isPaymentMethodAvailable('adyen_hpp')"
          :key="`adyenApplePay-${storedKey}`"
        />
      </div>
    </div>
    <div class="details-form-body">
      <DividerComponent/>
      <PayWith/>

      <ProgressBar v-if="emailEntered"/>

      <EmailAddress/>

      <Newsletter v-if="emailEntered"/>

      <div
        v-if="clickCollectTabsEnabled && emailEntered && !cart.is_virtual"
        class="shipping-type-toggle"
      >
        <button
          class="button details-button"
          :class="{'button--primary': !isClickAndCollect, 'button--tertiary' : isClickAndCollect}"
          @click="setNotClickAndCollect()">
          <DeliveryTabIcon
            :fill="!isClickAndCollect ? 'white' : '#0F273C'"
          />
          <TextField
            :text="$t('yourDetailsSection.deliverySection.shippingButton')"
            :data-cy="'home-delivery-title'"
          />
        </button>
        <button
          class="button click-collect-button"
          :class="{'button--primary': isClickAndCollect, 'button--tertiary' : !isClickAndCollect}"
          @click="setClickAndCollect()">
          <ClickCollectTabIcon
            :fill="isClickAndCollect ? 'white' : '#0F273C'"
          />
          <TextField
            :text="$t('yourDetailsSection.deliverySection.clickandCollectButton')"
            :data-cy="'click-collect-title'"
          />
        </button>
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
        v-if="emailEntered && customer.addresses.length && !isClickAndCollect && !cart.is_virtual"
        address-type="shipping"
        @showAddressBlock="showAddressBlock"
        @passSelectedItemId="passSelectedItemId"
      />

      <div class="address-form-error-message">
        <ErrorMessage v-if="addressInfoWrong"
                      :message="$t('errorMessages.addressWrongError')"/>
      </div>

      <div
        v-if="emailEntered && (!selected[address_type].id
          || (selected[address_type].id === 'custom' && selected[address_type].editing))
          && !isClickAndCollect && !cart.is_virtual"
        class="additional-detail-form"
      >
        <div
          class="delivery-section"
        >
          <div v-if="customer.addresses.length <= 0"
               class="details-form-title">
            <YourDetails fill="black"/>
            <TextField
              :text="yourDetailsText"
              :data-cy="'your-details-title'"
            />
            <div class="divider-line"></div>
          </div>
          <div v-else class="details-form-title saved-address">
            <Locate :data-cy="`${address_type}-new-address-icon`"/>
            <TextField
              class="address-block__title"
              :text="newAddressText"
              :data-cy="`${address_type}-new-address-title`"
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
            <Locate :data-cy="`${address_type}-where-to-icon`"/>
            <div class="delivery-section-title-text">
              <TextField
                :text="deliverWhereText"
                :data-cy="`${address_type}-where-to-icon`"
              />
            </div>
            <div class="divider-line"></div>
          </div>

          <div>
            <div>
              <AddressFinder
                v-if="!selected[address_type].id
                  || (selected[address_type].id === 'custom' && selected[address_type].editing)"
                :data-cy="address_type"
              />
            </div>
          </div>

          <ShippingForm v-if="selected[address_type].editing || !addressFinder.enabled"/>

          <LinkComponent
            v-if="!selected[address_type].id
              && !selected[address_type].editing && address_type === 'shipping'
              && addressFinder.enabled"
            class="manually-button"
            :label="$t('yourDetailsSection.deliverySection.addressForm.linkText')"
            :data-cy="'enter-address-manually-link'"
            @click.prevent="editAddress"
          />
        </div>
      </div>
      <div
        v-if="emailEntered && !selected[address_type].editing
          && !selected[address_type].isSavedAddressSelected
          && selected[address_type].id
          && !isUsingSavedShippingAddress
          && !isClickAndCollect
          && !cart.is_virtual"
        class="address-block"
        :class="customer.addresses.length > 0 ? 'saved-address-active' : ''"
      >
        <TextField
          class="address-block__title selected"
          :text="$t('yourDetailsSection.deliverySection.deliveryAddressTitle')"
          :data-cy="`${address_type}-address-selected-title`"
        />
        <div class="address-block__item">
          <article>
            <AddressBlock
              :address_type="`shipping`"
              :address="selected[address_type]"
              :data-cy="'selected'"
            />
          </article>
        </div>
        <div
          v-if="selected[address_type].id"
          class="address-block__edit"
          :aria-label="$t('yourDetailsSection.deliverySection.editButton')"
          @click.prevent="editAddress"
          @keydown.enter.prevent="editAddress"
          tabindex="0"
        >
          <Edit :data-cy="`${address_type}-address-selected-edit-icon`"/>
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
        v-if="emailEntered && !selected.billing.editing && !isClickAndCollect && !cart.is_virtual"
        type="submit"
        primary
        :label="proceedToShippingText"
        :disabled="!buttonEnabled && (!customer.id || !customerInfoValidation)"
        :data-cy="'proceed-to-shipping-button'"
        @click="submitShippingOption();"
      />
      <MyButton
        v-if="emailEntered && !selected.billing.editing && !isClickAndCollect && cart.is_virtual"
        type="submit"
        primary
        :label="proceedToPayText"
        :disabled="!selected.billing.id || (!customer.id && !billingInfoValidation)"
        :data-cy="'proceed-to-payment-button-virtual'"
        @click="submitBillingInfo();"
      />
    </div>
  </div>
</template>
<script>
// icons
import Locate from '@/components/Core/Icons/Locate/Locate.vue';
import YourDetails from '@/components/Core/Icons/YourDetails/YourDetails.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import DeliveryTabIcon from '@/components/Core/Icons/DeliveryTabIcon/DeliveryTabIcon.vue';
import ClickCollectTabIcon from '@/components/Core/Icons/ClickCollectTabIcon/ClickCollectTabIcon.vue';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import PayWith from '@/components/Steps/GlobalComponents/PayWithComponent/PayWith.vue';
import DividerComponent from '@/components/Steps/CustomerInfoPage/DividerComponent/DividerComponent.vue';
import AddressFinder from '@/components/Steps/CustomerInfoPage/AddressFinder/AddressFinder.vue';
import NameFields from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/Form/Name/Name.vue';
import ShippingForm from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/ShippingForm/ShippingForm.vue';
import AddressBlock from '@/components/Steps/CustomerInfoPage/Addresses/AddressBlock/AddressBlock.vue';
import EmailAddress from '@/components/Steps/CustomerInfoPage/EmailAddress/EmailAddress.vue';
import LinkComponent from '@/components/Core/ActionComponents/Link//Link.vue';
import AddressList from '@/components/Steps/CustomerInfoPage/Addresses/AddressList/AddressList.vue';
import BraintreeGooglePay from '@/components/Steps/PaymentPage/Braintree/GooglePay/GooglePay.vue';
import BraintreeApplePay from '@/components/Steps/PaymentPage/Braintree/ApplePay/ApplePay.vue';
import BraintreePayPal from '@/components/Steps/PaymentPage/Braintree/PayPal/PayPal.vue';
import AdyenGooglePay from '@/components/Steps/PaymentPage/Adyen/GooglePay/GooglePay.vue';
import AdyenApplePay from '@/components/Steps/PaymentPage/Adyen/ApplePay/ApplePay.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import BillingForm from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/BillingForm/BillingForm.vue';
import Newsletter from '@/components/Core/ContentComponents/Newsletter/Newsletter.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ClickAndCollect from '@/components/Steps/CustomerInfoPage/Addresses/ClickAndCollect/ClickAndCollect.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';

// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';
import formatPrice from '@/helpers/payment/formatPrice';
import continueToDeliveryDataLayer from '@/helpers/dataLayer/continueToDeliveryDataLayer';

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
    ProgressBar,
    Recaptcha,
    Agreements,
    DeliveryTabIcon,
    ClickCollectTabIcon,
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
      savedAddressID: null,
      customerInfoValidation: false,
      billingInfoValidation: false,
      addressFormErrorMessage: false,
      storedKey: 0,
      instantCheckoutText: '',
      instantCheckoutTextId: 'gene-bettercheckout-instantcheckout-text',
      yourDetailsText: '',
      yourDetailsTextId: 'gene-bettercheckout-your-details-text',
      deliverWhereText: '',
      deliverWhereTextId: 'gene-bettercheckout-deliver-where-text',
      newAddressText: '',
      newAddressTextId: 'gene-bettercheckout-new-address-text',
      proceedToShippingText: '',
      proceedToShippingTextId: 'gene-bettercheckout-proceedtoshipping-text',
      proceedToPayText: '',
      proceedToPayTextId: 'gene-bettercheckout-proceedtopay-text',
      buttonEnabled: false,
      addressInfoWrong: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'cartEmitter', 'subtotalInclTax']),
    ...mapState(useConfigStore, ['addressFinder', 'custom', 'storeCode', 'clickCollectTabsEnabled']),
    ...mapState(useCustomerStore, [
      'inputsSanitiseError',
      'customer',
      'isLoggedIn',
      'emailEntered',
      'selected',
      'isUsingSavedShippingAddress',
    ]),
    ...mapState(useShippingMethodsStore, ['isClickAndCollect']),
    ...mapState(usePaymentStore, ['errorMessage', 'isExpressPaymentsVisible', 'isPaymentMethodAvailable']),
    ...mapState(useBraintreeStore, ['paypal']),
  },
  created() {
    this.cartEmitter.on('cartUpdated', async () => {
      this.clearPaymentReponseCache();
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
    this.instantCheckoutText = window.geneCheckout?.[this.instantCheckoutTextId] || this.$t('instantCheckout');
    this.yourDetailsText = window.geneCheckout?.[this.yourDetailsTextId] || this.$t('yourDetailsSection.title');
    this.deliverWhereText = window.geneCheckout?.[this.deliverWhereTextId]
    || this.$t('yourDetailsSection.deliverySection.title');
    this.newAddressText = window.geneCheckout?.[this.newAddressTextId]
    || this.$t('yourDetailsSection.deliverySection.newAddressTitle');
    this.proceedToPayText = window.geneCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');
    this.proceedToShippingText = window.geneCheckout?.[this.proceedToShippingTextId]
    || this.$t('yourDetailsSection.deliverySection.toShippingButton');

    await this.getInitialConfig();
    await this.getCart();

    const types = {
      shipping: 'customerInfoValidation',
      billing: 'billingInfoValidation',
    };

    Object.keys(types).forEach((type) => {
      const first = this.validateNameField(type, 'First name', this.selected[type].firstname);
      const last = this.validateNameField(type, 'Last name', this.selected[type].lastname);
      const phone = this.validatePhone(type, this.selected[type].telephone);

      this[types[type]] = first && last && phone;
    });

    if (this.customer.addresses.length <= 0 && this.validateAddress(this.address_type)) {
      this.setAddressAsCustom(this.address_type);
    }
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
    ...mapActions(useAdyenStore, ['clearPaymentReponseCache']),
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
@import "@/components/Steps/CustomerInfoPage/DetailsPage/styles.scss";
</style>
