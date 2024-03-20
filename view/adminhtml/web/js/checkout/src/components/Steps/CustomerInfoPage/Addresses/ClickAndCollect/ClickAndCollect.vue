<template>
  <div class="click-and-collect-container">
    <Loader v-if="loading" />
    <div class="click-and-collect-title-container">
      <TextField
        class="click-and-collect-title click-and-collect-semibold"
        :text="$t('yourDetailsSection.deliverySection.addressForm.collectLocations')"
      />

      <LinkComponent
        v-if="selected.shipping.id"
        :label="$t('yourDetailsSection.editButton')"
        @click.prevent="editShippingAdress"
      />
    </div>
    <div
      v-if="!selected.shipping.id"
    >
      <div class="click-and-collect-input">
        <TextInput
          v-model="query"
          type="text"
          :placeholder="$t('yourDetailsSection.deliverySection.addressFinder.placeholder')"
          :label="$t('yourDetailsSection.deliverySection.addressFinder.label')"
          required
          :error="postcodeError"
          :error-message="postcodeErrorMessage"
          @input="getLocations"
        />
        <Search stroke="black" />
      </div>

      <LinkComponent
        :label="$t('yourDetailsSection.deliverySection.addressForm.useMyLocation')"
        class="click-and-collect-use-location"
        @click.prevent="useMyLocation"
      />

      <div
        v-if="query && !queryTimeout"
        class="click-and-collect-container"
      >
        <TextField
          class="click-and-collect-title click-and-collect-semibold"
          :text="$t('yourDetailsSection.deliverySection.addressForm.closestLocations')"
        />

        <div
          class="click-and-collect-locations"
        >
          <TextField
            v-if="!foundLocations.length"
            :text="$t('yourDetailsSection.deliverySection.addressForm.noLocations')"
          />
          <ClickAndCollectLocation
            v-for="location in foundLocations"
            :key="location.site_number"
            :location="location"
          />
        </div>
      </div>
    </div>

    <TextField
      v-if="selected.shipping.id"
      :text="`${clickAndCollectLocation.site_name} -
        ${$t('yourDetailsSection.deliverySection.addressForm.collectionDistance',
      { distance: clickAndCollectLocation.miles.toFixed(2) })}`"
    />
    <AddressBlock
      v-if="selected.shipping.id"
      class="click-and-collect-address"
      :show-name-fields="false"
      :address_type="`shipping`"
      :address="selected.shipping"
    />

    <GoogleMap
      v-if="selected.shipping.id && clickAndCollectLocation.lat && clickAndCollectLocation.long"
      :lat="clickAndCollectLocation.lat"
      :lng="clickAndCollectLocation.long"
    />

    <div
      v-if="selected.shipping.id"
      class="click-and-collect-container"
    >
      <div class="click-and-collect-title-container">
        <TextField
          class="click-and-collect-title click-and-collect-semibold"
          :text="$t('yourDetailsSection.deliverySection.addressForm.collectionName')"
        />

        <LinkComponent
          v-if="selected.shipping.id && customInfoSubmitted"
          :label="$t('yourDetailsSection.editButton')"
          @click.prevent="customInfoSubmitted = false"
        />
      </div>
      <div v-if="!customInfoSubmitted">
        <NameFields
          address_type="shipping"
          @isCustomerInfoFull="isCustomerInfoFull"
        />

        <MyButton
          class="click-and-collect-container"
          type="submit"
          primary
          :label="$t('yourDetailsSection.deliverySection.addressForm.submitCollectionDetails')"
          :disabled="!customerInfoValidation"
          @click="submitCollectionDetails"
        />
      </div>
      <div v-else>
        <TextField
          :text="`${selected.shipping.firstname} ${selected.shipping.lastname}`"
        />
        <TextField
          :text="selected.shipping.telephone"
        />
      </div>
    </div>

    <div
      v-if="selected.shipping.id && customInfoSubmitted"
      class="click-and-collect-container"
    >
      <TextField
        class="click-and-collect-title click-and-collect-semibold"
        :text="$t('yourDetailsSection.deliverySection.addressForm.collectionBillingTitle')"
      />

      <div class="click-and-collect-billing">
        <AddressList
          v-if="customer.addresses.length"
          :display-title="false"
          address-type="billing"
          @showAddressBlock="showAddressBlock"
        />

        <BillingForm
          :show-checkbox="false"
          class="click-and-collect-address"
        />
      </div>

      <MyButton
        v-if="!selected.billing.editing"
        :disabled="!selected.billing.id"
        class="click-and-collect-container"
        type="submit"
        primary
        :label="$t('yourDetailsSection.deliverySection.toShippingButton')"
        @click="submitClickAndCollect();"
      />
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

// Components
/* eslint-disable max-len */
import ClickAndCollectLocation
  from '@/components/Steps/CustomerInfoPage/Addresses/ClickAndCollect/ClickAndCollectLocation/ClickAndCollectLocation.vue';
import LinkComponent from '@/components/Core/ActionComponents/Link/Link.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import NameFields from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/Form/Name/Name.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import AddressBlock from '@/components/Steps/CustomerInfoPage/Addresses/AddressBlock/AddressBlock.vue';
import AddressList from '@/components/Steps/CustomerInfoPage/Addresses/AddressList/AddressList.vue';
import BillingForm from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/BillingForm/BillingForm.vue';
import GoogleMap from '@/components/Steps/CustomerInfoPage/Addresses/GoogleMap/GoogleMap.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

// Icons
import Search from '@/components/Core/Icons/Search/Search.vue';

// Services
import getClickAndCollectLocations from '@/services/shipping/getClickAndCollectLocations';
import getUsersPostcode from '@/services/addresses/getUsersPostcode';

// Helpers
import getEmptyAddress from '@/helpers/addresses/getEmptyAddress';

export default {
  name: 'ClickAndCollect',
  components: {
    ClickAndCollectLocation,
    LinkComponent,
    Search,
    TextField,
    TextInput,
    NameFields,
    MyButton,
    AddressBlock,
    AddressList,
    BillingForm,
    GoogleMap,
    Loader,
  },
  data() {
    return {
      query: '',
      foundLocations: [],
      customerInfoValidation: false,
      customInfoSubmitted: false,
      isAddressBlockVisible: true,
      queryTimeout: null,
      loading: false,
      postcodeError: false,
      postcodeErrorMessage: '',
    };
  },
  computed: {
    ...mapState(useCustomerStore, [
      'customer',
      'selected',
    ]),
    ...mapState(useShippingMethodsStore, ['clickAndCollectLocation', 'setClickAndCollectLocation']),
  },
  async mounted() {
    this.customInfoSubmitted = this.selected.shipping.firstname && this.selected.shipping.lastname;

    // If there is a selected shipping method but no click and collect locations try to get some.
    if (this.selected.shipping.id && !Object.keys(this.clickAndCollectLocation).length) {
      const locations = await getClickAndCollectLocations(this.selected.shipping.postcode);

      if (locations.agents.length) {
        const [location] = locations.agents;
        this.setClickAndCollectLocation(location);
      }
    }
  },
  methods: {
    ...mapActions(useCustomerStore, ['setAddressToStore', 'setAddressAsEditing']),
    ...mapActions(useShippingMethodsStore, ['clearShippingMethodCache', 'submitShippingInfo']),
    ...mapActions(useStepsStore, ['goToShipping']),
    async useMyLocation() {
      this.postcodeError = false;
      this.postcodeErrorMessage = '';
      this.loading = true;
      const postcode = await getUsersPostcode();

      if (postcode) {
        this.query = postcode;
        this.getLocations();
      } else {
        // If we have no postcode then we must have errored.
        this.postcodeError = true;
        this.postcodeErrorMessage = this.$t('errorMessages.postcodeLookup');
        this.loading = false;
      }
    },
    editShippingAdress() {
      // Only modify the address details and not the customer names/telephone.
      const emptyAddress = getEmptyAddress();
      const newAddress = Object.assign(emptyAddress, {
        firstname: this.selected.shipping.firstname,
        lastname: this.selected.shipping.lastname,
        telephone: this.selected.shipping.telephone,
      });
      this.setAddressToStore(newAddress, 'shipping');
    },
    getLocations() {
      // Clear the existing timeout if it exists.
      if (this.queryTimeout) {
        clearTimeout(this.queryTimeout);
      }

      // On input clear any error messages.
      this.postcodeError = false;
      this.postcodeErrorMessage = '';

      this.queryTimeout = setTimeout(async () => {
        if (this.query) {
          const locations = await getClickAndCollectLocations(this.query);
          this.foundLocations = locations.agents;
          this.loading = false;
        }
        this.queryTimeout = null;
      }, 1000);
    },
    showAddressBlock(value) {
      this.isAddressBlockVisible = value;
    },
    isCustomerInfoFull(value) {
      this.customerInfoValidation = value;
    },
    submitCollectionDetails() {
      this.customInfoSubmitted = true;
    },
    async submitClickAndCollect() {
      this.clearShippingMethodCache();
      this.goToShipping();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
