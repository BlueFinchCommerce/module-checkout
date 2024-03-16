<template>
  <div v-if="isPayByBankActive">
    <button
      class="rvvup-button payment-method"
      :aria-label="$t('rvvup.rvvupPaymentLabel')"
      type="button"
      @click="selectPaymentCard"
    >
      <span
        class="payment-method-radio"
        :class="{'selected': isMethodSelected}"
        aria-hidden="true"
      />
      <img
        :src="getRvvupIcon"
        :alt="getRvvupIcon"
      >
      <span class="payment-method-name">
        {{ $t('rvvup.payByBankLabel') }}
      </span>
    </button>

    <div
      :class="{'rvvup-method-visible': isMethodSelected}"
      class="rvvup-method"
    >
      <div
        v-if="loading"
        class="rvvup-loader"
      >
        <Loader
          :overlay="false"
        />
      </div>

      <IframeComponent
        v-if="payByBankDescriptionSrc && isMethodSelected"
        :title="'Rvvup payment modal'"
        :width="400"
        :height="480"
        :src="payByBankDescriptionSrc"
      />
      <button
        class="button button--primary button--checkout button--full"
        type="button"
        @click="startRvvupPayment"
      >
        <span>
          {{ $t('rvvup.payByBankButton') }}
        </span>
      </button>

      <modal
        :visible="showPaymentModal"
        :classes="'rvvup-modal'"
        :header="false"
        :footer="false"
        @close="cancelRvvupPayment"
      >
        <template #body>
          <IframeComponent
            v-if="iframeUrl"
            :title="'Rvvup payment modal'"
            :width="frameWidth"
            :height="frameHeight"
            :src="iframeUrl"
          />
        </template>
      </modal>
    </div>
  </div>
</template>

<script>

// Pinia
import { mapState, mapActions } from 'pinia';

// Stores
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import Modal from '@/components/Core/ActionComponents/Modal/Modal.vue';
import IframeComponent from '@/components/Core/ActionComponents/Iframe/Iframe.vue';
import Loader from '@/components/Core/Icons/Loader/Loader.vue';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import getRvvupPaymentMethods from '@/services/payments/getRvvupPaymentMethods';
import getRvvupPaymentActions from '@/services/payments/getRvvupPaymentActions';

// icons
import rvvupPaymentSvg from '@/icons/rvvup-payment.svg';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

export default {
  name: 'RvvupPayByBank',
  components: {
    Modal,
    IframeComponent,
    Loader,
  },
  props: {
    method: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      isPayByBankActive: false,
      payByBankDescriptionSrc: '',
      isMethodSelected: false,
      showPaymentModal: false,
      loading: false,
      frameWidth: null,
      frameHeight: null,
      orderId: null,
      iframeUrl: '',
      cancellationUrl: '',
    };
  },
  computed: {
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
    ]),
    ...mapState(useCartStore, [
      'maskedId',
    ]),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
    ]),

    getRvvupIcon() {
      return `${getStaticUrl(rvvupPaymentSvg)}`;
    },

    /**
     * Get Cancel Url
     */
    getCancelActionUrl() {
      return this.cancelActions ? this.cancelActions.value : '';
    },
  },
  mounted() {
    window.addEventListener('message', (event) => {
      /* eslint-disable no-prototype-builtins */
      if (!this.isMethodSelected) {
        return;
      }

      const eventData = event.data;
      const eventType = eventData.type;

      if (eventType === 'rvvup-payment-modal|close') {
        this.cancelRvvupPayment();
      }

      if (eventType === 'rvvup-payment-modal|resize') {
        const height = eventData.hasOwnProperty('height') ? eventData.height : null;
        const width = eventData.hasOwnProperty('width') ? eventData.width : null;

        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const chosenWidth = width > windowWidth ? windowWidth - 100 : width;
        const chosenHeight = height > windowHeight ? windowHeight - 100 : height;

        this.frameHeight = chosenHeight;
        this.frameWidth = chosenWidth;
      }
    });
  },
  async created() {
    this.setPaymentErrors();

    const availablePaymentMethods = await getRvvupPaymentMethods();
    const payByBank = this.getPayByBankMethod(availablePaymentMethods);
    this.isPayByBankActive = !!payByBank;
    this.payByBankDescriptionSrc = payByBank.summary_url;

    // On payment selected if it's not RVVUP then close.
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      if (id !== 'rvvup_yapily') {
        this.isMethodSelected = false;
      }
    });

    // On payment selected if it's not RVVUP then close.
    this.paymentEmitter.on('adyenPaymentDisplayingError', ({ isDisplaying }) => {
      this.isPayByBankActive = !isDisplaying;
    });
  },
  methods: {
    ...mapActions(usePaymentStore, ['setRvvupErrorMessage']),

    /**
     * Remove URL Param
     * @param {*} key
     * @param {*} sourceURL
     */
    removeUrlErrorParam(key, sourceURL) {
      let rtn = sourceURL.split('?')[0];
      let param;
      let paramsArr = [];
      const queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
      if (queryString !== '') {
        paramsArr = queryString.split('&');
        for (let i = paramsArr.length - 1; i >= 0; i -= 1) {
          [param] = paramsArr[i].split('=');
          if (param === key) {
            paramsArr.splice(i, 1);
          }
        }
        if (paramsArr.length) rtn = `${rtn}?${paramsArr.join('&')}`;
      }
      return rtn;
    },

    /**
     *
     * @param {*} paymentMethodsResponse
     */
    getPayByBankMethod(paymentMethodsResponse) {
      return paymentMethodsResponse.find((method) => method.code === 'rvvup_yapily');
    },

    /**
     * Select Pay by bank method
     */
    selectPaymentCard() {
      this.isMethodSelected = true;

      this.paymentEmitter.emit('paymentMethodSelected', {
        id: 'rvvup_yapily',
        type: 'rvvup_yapily',
      });
    },

    /**
     * Open modal
     * @param {*} event
     */
    openModal() {
      document.body.classList.add('no-scrollable');
      this.showPaymentModal = true;
    },

    /**
     * Close Modal
     */
    closeModal() {
      document.body.classList.remove('no-scrollable');
      this.showPaymentModal = false;
    },

    /**
     * set Iframe Url
     * @param {*} url
     */
    setIframeUrl(url) {
      this.iframeUrl = url;
    },

    /**
     * set Cancellation Url
     * @param {*} url
     */
    setCancellationUrl(url) {
      this.cancellationUrl = url;
    },

    /**
     * Set Payment Errors
     */
    setPaymentErrors() {
      const { href } = window.location;
      const params = href.split('?')[1];

      // Be sure url params exist
      if (params && params !== '') {
        const result = params.split('&').reduce((res, item) => {
          const [key, value] = item.split('=');
          return { ...res, [key]: value };
        }, {});

        let message;

        Object.keys(result).forEach((objectKey) => {
          if (result[objectKey] === 'cancelled') {
            message = this.$t('errorMessages.rvvupPayment.cancelled');
          } else if (result[objectKey] === 'unexpected') {
            message = this.$t('errorMessages.rvvupPayment.unexpected');
          } else if (result[objectKey] === 'declined') {
            message = this.$t('errorMessages.rvvupPayment.declined');
          } else if (result[objectKey] === 'expired') {
            message = this.$t('errorMessages.rvvupPayment.expired');
          } else if (result[objectKey] === 'failed') {
            message = this.$t('errorMessages.rvvupPayment.failed');
          } else {
            message = this.$t('errorMessages.rvvupPayment.other');
          }
        });

        this.setRvvupErrorMessage(message);

        // remove url param after 5 seconds to clear checkout payments url
        // clear error messages after 5 seconds

        setTimeout(() => {
          const alteredURL = this.removeUrlErrorParam('status', href);
          window.history.replaceState(null, '', alteredURL);
          this.setRvvupErrorMessage('');
        }, 10000);
      }
    },

    /**
     * Start Rvvup Payment:
     * Create order and store order id
     * Call Rvvup once order is created
     */
    startRvvupPayment() {
      this.loading = true;

      const paymentMethod = { method: 'rvvup_YAPILY' };
      const data = {
        billingAddress: this.getSelectedBillingAddress,
        paymentMethod,
        email: this.customer.email,
        cartId: this.maskedId,
      };

      createPayment(data)
        .then((response) => {
          this.orderId = response;
          this.rvvupPaymentActions();
        })
        .catch((error) => {
          /* @todo - handle errors */
          setTimeout(() => {
            this.setRvvupErrorMessage(this.$t('errorMessages.rvvupPayment.qtyNotAvailable'));
            this.isMethodSelected = false;
            throw Error(error);
          }, 5000);
        });

      setTimeout(() => {
        this.setRvvupErrorMessage('');
      }, 20000);
    },

    /**
     * Call Rvvup
     * On success then set the cancel and success actions.
     * If there is a success action and a url then use it to set the iframe url
     * Open modal on success and handle errors on fail.
     */
    async rvvupPaymentActions() {
      await getRvvupPaymentActions()
        .then((response) => {
          const authorization = response.find((method) => method.type === 'authorization');
          const cancel = response.find((method) => method.type === 'cancel');

          if (authorization && authorization.value) {
            this.loading = false;
            this.setIframeUrl(authorization.value);
            this.setCancellationUrl(cancel.value);
            this.openModal();
          } else {
            /* @todo - handle errors */
          }
        }).catch((error) => {
          /* @todo - handle errors */
          throw Error(error);
        });
    },

    /**
     * Cancel Rvvup Payment
     */
    cancelRvvupPayment() {
      if (this.cancellationUrl) {
        this.setIframeUrl(this.cancellationUrl);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
