<template>
  <Loader v-if="isLoading" />
  <div v-if="Object.keys(hokodo).length !== 0 && isPaymentMethodAvailable('hokodo_bnpl')">
    <ErrorMessage
      v-if="hokodoScriptError"
      :message="hokodoErrorMessage"
    />
    <div v-if="hokodo.hokodoData.hokodo_enabled">
      <div
        class="hokodo-button payment-method"
        @click="selectPaymentMethod"
        @keydown="selectPaymentMethod"
      >
        <span
          class="payment-method-radio"
          :class="{'selected': isMethodSelected}"
          aria-hidden="true"
        />

        <HokodoPaymentTitle :data="hokodo" />
      </div>

      <div
        v-show="isMethodSelected && !isLoading"
        class="hokodo-container"
      >
        <div id="hokodoCompanySearch" />
        <div id="hokodoCheckout" />
      </div>
    </div>
  </div>
</template>

<script>

// Pinia
import { mapState, mapActions } from 'pinia';

// stores
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';
import useHokodoStore from '@/stores/PaymentStores/HokodoStore';

// components
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
import HokodoPaymentTitle from '@/components/Steps/PaymentPage/Hokodo/HokodoPaymentTitle/HokodoPaymentTitle.vue';

// helpers
import requestHokodoOffer from '@/helpers/payment/requestHokodoOffer';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

// services
import getHokodoCustomerData from '@/services/customer/getHokodoCustomerData';
import createPayment from '@/services/payments/createPaymentGraphQl';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

export default {
  name: 'HokodoComponent',
  components: {
    HokodoPaymentTitle,
    ErrorMessage,
    Loader,
  },
  data() {
    return {
      isMethodSelected: false,
      isHokodoActive: false,
      hokodoScriptError: false,
      hokodoErrorMessage: '',
      isLoading: false,
      searchConfig: {},
    };
  },
  computed: {
    ...mapState(useConfigStore, ['hokodoUser', 'currencyCode', 'locale', 'countryCode']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable']),
    ...mapState(useCustomerStore, ['customer', 'getSelectedBillingAddress']),
    ...mapState(useCartStore, ['cartEmitter']),
    ...mapState(useHokodoStore, ['hokodo', 'offer', 'companyId']),
  },
  async created() {
    await this.getInitialConfig();
    await this.getPaymentMethods();
    await this.getHokodoConfigs();

    try {
      if (!window.hokodoSdk) {
        await getHokodoCustomerData.getHokodoScripts(this.hokodo.hokodoData.hokodo_sdk_url);
        const sdkConfig = [
          { locale: this.locale },
          { currency: this.currencyCode },
        ];
        window.hokodoSdk = window.Hokodo(this.hokodo.hokodoData.hokodo_sdk_key, sdkConfig);
        window.hokodoElements = window.hokodoSdk.elements();
      }
    } catch (error) {
      this.hokodoScriptError = true;
      this.hokodoErrorMessage = error;
    }

    // On payment selected if it's not Hokodo then close.
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      if (id !== 'hokodo_bnpl') {
        this.isMethodSelected = false;
      }
    });

    // On payment selected if it's not Hokodo then close.
    this.paymentEmitter.on('adyenPaymentDisplayingError', ({ isDisplaying }) => {
      console.log('gello1');
      this.isHokodoActive = !isDisplaying;
    });
  },
  beforeUnmount() {
    if (this.removeSubcription) {
      this.removeSubcription();
    }

    this.destroyCheckout();
    this.unmountSearch();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useHokodoStore, ['getHokodoConfigs', 'getHokodoCompanyId', 'setOffer', 'setCompanyId']),
    ...mapActions(usePaymentStore, ['getPaymentMethods']),

    /**
     * Select Hokodo payment method
     */
    async selectPaymentMethod() {
      if (!this.companySearch || (this.companySearch && Object.keys(this.companySearch).length === 0)) {
        this.isMethodSelected = true;

        this.paymentEmitter.emit('paymentMethodSelected', {
          id: 'hokodo_bnpl',
          type: 'hokodo_bnpl',
        });

        this.mountCheckout();
        await this.mountSearch();
      }
    },

    async mountSearch() {
      if (!this.companySearch) {
        this.searchConfig.country = this.countryCode;
        this.searchConfig.countryOptions = this.hokodo.hokodoData.hokodo_sdk_countries;

        await this.getHokodoCompanyId();

        if (this.companyId) {
          this.searchConfig.companyId = this.companyId;
        }

        const existingSearch = window.hokodoElements.getElement('companySearch');

        if (existingSearch) {
          existingSearch.destroy();
          this.setCompanyId(null);
        }

        this.companySearch = window.hokodoElements.create('companySearch', this.searchConfig);

        this.companySearch.on('companySelection', async (company) => {
          const id = company ? company.id : null;
          this.setCompanyId(id);
        });

        this.companySearch.mount('#hokodoCompanySearch');
      }
    },

    async mountCheckout() {
      const hokodoStore = useHokodoStore();
      this.removeSubcription = hokodoStore.$subscribe((mutation) => {
        if (mutation.type === 'patch object' && mutation.payload.offer) {
          this.orderPlacement();
        }

        if (mutation.type === 'patch object' && 'companyId' in mutation.payload) {
          if (mutation.payload.companyId) {
            this.createOfferAction(mutation.payload.companyId);
          } else {
            this.destroyCheckout();
          }
        }
      });
    },

    orderPlacement() {
      this.destroyCheckout();

      if (document.getElementById('hokodoCheckout') !== null) {
        if (!this.userCheckout && this.offer && this.companyId) {
          this.userCheckout = window.hokodoElements.create('checkout', {
            paymentOffer: this.offer,
          });

          this.userCheckout.on('failure', () => {
            this.setOffer(null);
          });

          this.userCheckout.on('success', async () => {
            const paymentMethod = {
              method: 'hokodo_bnpl',
              additional_data: {
                hokodo_payment_offer_id: this.offer.id,
                hokodo_order_id: this.offer.order,
              },
            };
            const payload = {
              billingAddress: this.getSelectedBillingAddress,
              paymentMethod,
              email: this.customer.email,
              cartId: this.maskedId,
            };

            await createPayment(payload)
              .then(async () => {
                await refreshCustomerData(getCartSectionNames());
                window.location.href = getSuccessPageUrl();
              })
              .catch((error) => {
                this.isMethodSelected = false;
                throw Error(error);
              });
          });

          this.userCheckout.mount('#hokodoCheckout');
        }
      }
    },

    createOfferAction(companyId) {
      if (companyId) {
        this.isLoading = true;
        return requestHokodoOffer(companyId)
          .then((response) => {
            if (response.offer !== undefined) {
              this.setOffer(response.offer);
              this.isLoading = false;
            }
          }).catch((error) => {
            this.hokodoScriptError = true;
            this.hokodoErrorMessage = error;
            this.setOffer(null);
          });
      }

      return null;
    },

    destroyCheckout() {
      if (this.userCheckout) {
        this.userCheckout.destroy();
        delete this.userCheckout;
      }
    },

    unmountSearch() {
      if (this.companySearch) {
        this.companySearch.unmount();
        delete this.companySearch;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
