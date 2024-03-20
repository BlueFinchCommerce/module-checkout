<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable max-len -->
<template>
  <div class="adyen-payment__title">
    <Payment
      class="adyen-payment__icon"
      fill="black"
    />
    <TextField
      v-if="!storedPayments"
      class="adyen-payment__header"
      :text="paymentStepText"
    />
    <div class="divider-line"></div>
  </div>
  <div :class="loadingPaymentMethods ? 'text-loading' : ''">
    <AdyenPaymentMethods
      v-if="isLoggedIn && adyenVaultEnabled"
      :id="storedPaymentsId"
      :key="`storePayments-${storedKey}`"
      :stored-payments="true"
    />
    <div id="adyen-dropin-container-new">
      <div class="adyen-checkout__dropin adyen-checkout__dropin--ready">
        <ul
          class="DropinComponent-module_adyen-checkout__payment-methods-list__mAjAm adyen-checkout__payment-methods-list"
          role="radiogroup"
          aria-label="Choose a payment method"
          required="true"
        >
          <li class="adyen-checkout__payment-method DropinComponent-module_adyen-checkout__payment-method__nWdwg adyen-checkout__payment-method--card adyen-checkout__payment-method--credit adyen-checkout__payment-method--selected DropinComponent-module_adyen-checkout__payment-method--selected__6egZF scheme-c77cc0a4-8978-4717-a3d6-b439d66d539b ">
            <div class="adyen-checkout__payment-method__header">
              <button
                id="button-scheme-c77cc0a4-8978-4717-a3d6-b439d66d539b"
                class="adyen-checkout__payment-method__header__title"
                role="radio"
                type="button"
                aria-checked="true"
              >
                <span
                  class="adyen-checkout__payment-method__radio adyen-checkout__payment-method__radio--selected"
                  aria-hidden="true"
                /><span class="adyen-checkout__payment-method__image__wrapper DropinComponent-module_adyen-checkout__payment-method__image__wrapper__6NWzA adyen-checkout__payment-method__image__wrapper--outline"><img
                  class="adyen-checkout__payment-method__image DropinComponent-module_adyen-checkout__payment-method__image__nB80V adyen-checkout__image adyen-checkout__image--loaded"
                  src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/card.svg"
                  alt="Credit or debit card"
                ></span><span class="adyen-checkout__payment-method__name adyen-checkout__payment-method__name--selected">Credit or debit card</span>
              </button>
            </div>
            <div
              id="container-scheme-c77cc0a4-8978-4717-a3d6-b439d66d539b"
              class="adyen-checkout__payment-method__details DropinComponent-module_adyen-checkout__payment-method__details__-rsW7"
              role="region"
              aria-labelledby="button-scheme-c77cc0a4-8978-4717-a3d6-b439d66d539b"
            >
              <div class="adyen-checkout__payment-method__details__content">
                <div
                  class="adyen-checkout__card-input CardInput-module_card-input__wrapper__wXSCw adyen-checkout__card-input--credit"
                  role="form"
                  aria-describedby="creditCardErrors"
                >
                  <div style="position: relative;">
                    <div class="LoadingWrapper-module_loading-input__spinner__GxA51">
                      <div class="adyen-checkout__spinner__wrapper ">
                        <div class="adyen-checkout__spinner adyen-checkout__spinner--large" />
                      </div>
                    </div>
                    <div class="adyen-checkout__loading-input__form LoadingWrapper-module_loading-input__form__ffCKa">
                      <div class="adyen-checkout__card__form">
                        <div class="adyen-checkout__field adyen-checkout__field--cardNumber">
                          <label
                            class="adyen-checkout__label"
                            for="adyen-checkout-encryptedCardNumber-1705503916981"
                          >
                            <span class="adyen-checkout__label__text">Card number</span>
                            <div
                              class="adyen-checkout__input-wrapper"
                              dir="ltr"
                            >
                              <span
                                data-cse="encryptedCardNumber"
                                data-uid="adyen-checkout-encryptedCardNumber-1705503916981"
                                class="adyen-checkout__input adyen-checkout__input--large adyen-checkout__card__cardNumber__input CardInput-module_adyen-checkout__input__11tlB"
                              >
                                <img
                                  class="CardInput-module_card-input__icon__3Cz5M adyen-checkout__card__cardNumber__brandIcon"
                                  alt="card"
                                  src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/nocard.svg"
                                  aria-hidden="true"
                                >
                              </span>
                            </div>
                          </label>
                        </div>
                        <span class="adyen-checkout__card__brands"><span class="adyen-checkout__card__brands__brand-wrapper"><img
                          src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/visa.svg"
                          alt=""
                          class="adyen-checkout__image adyen-checkout__image--loaded"
                        ></span><span class="adyen-checkout__card__brands__brand-wrapper"><img
                          src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/mc.svg"
                          alt=""
                          class="adyen-checkout__image adyen-checkout__image--loaded"
                        ></span></span>
                        <div class="adyen-checkout__card__exp-cvc adyen-checkout__field-wrapper">
                          <div class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field__exp-date adyen-checkout__field--expiryDate">
                            <label
                              class="adyen-checkout__label"
                              for="adyen-checkout-encryptedExpiryDate-1705503916982"
                            >
                              <span class="adyen-checkout__label__text">Expiry date</span>
                              <div
                                class="adyen-checkout__input-wrapper"
                                dir="ltr"
                              >
                                <span
                                  data-cse="encryptedExpiryDate"
                                  data-uid="adyen-checkout-encryptedExpiryDate-1705503916982"
                                  class="adyen-checkout__input adyen-checkout__input--small adyen-checkout__card__exp-date__input CardInput-module_adyen-checkout__input__11tlB"
                                />
                                <div
                                  class="adyen-checkout__field__exp-date_hint_wrapper"
                                  uniqueid="adyen-checkout-encryptedExpiryDate-1705503916982"
                                ><img
                                  src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/expiry_date_hint.svg"
                                  class="adyen-checkout__field__exp-date_hint"
                                  alt="Expiry date"
                                ></div>
                              </div>
                            </label>
                          </div>
                          <div class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field__cvc adyen-checkout__field--securityCode">
                            <label
                              class="adyen-checkout__label"
                              for="adyen-checkout-encryptedSecurityCode-1705503916983"
                            >
                              <span class="adyen-checkout__label__text">CVC / CVV</span>
                              <div
                                class="adyen-checkout__input-wrapper"
                                dir="ltr"
                              >
                                <span
                                  data-cse="encryptedSecurityCode"
                                  data-uid="adyen-checkout-encryptedSecurityCode-1705503916983"
                                  class="adyen-checkout__input adyen-checkout__input--small adyen-checkout__card__cvc__input CardInput-module_adyen-checkout__input__11tlB"
                                />
                                <div
                                  class="adyen-checkout__card__cvc__hint__wrapper adyen-checkout__field__cvc--back-hint"
                                  aria-hidden="true"
                                >
                                  <svg
                                    class="adyen-checkout__card__cvc__hint adyen-checkout__card__cvc__hint--front"
                                    width="27"
                                    height="18"
                                    viewBox="0 0 27 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0 3C0 1.34315 1.34315 0 3 0H24C25.6569 0 27 1.34315 27 3V15C27 16.6569 25.6569 18 24 18H3C1.34315 18 0 16.6569 0 15V3Z"
                                      fill="#E6E9EB"
                                    />
                                    <rect
                                      x="4"
                                      y="12"
                                      width="19"
                                      height="2"
                                      fill="#B9C4C9"
                                    />
                                    <rect
                                      x="4"
                                      y="4"
                                      width="4"
                                      height="4"
                                      rx="1"
                                      fill="white"
                                    />
                                    <rect
                                      class="adyen-checkout__card__cvc__hint__location"
                                      x="16.5"
                                      y="4.5"
                                      width="7"
                                      height="5"
                                      rx="2.5"
                                      stroke="#C12424"
                                    />
                                  </svg>
                                  <svg
                                    class="adyen-checkout__card__cvc__hint adyen-checkout__card__cvc__hint--back"
                                    width="27"
                                    height="18"
                                    viewBox="0 0 27 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M27 4.00001V3.37501C27 2.4799 26.6444 1.62146 26.0115 0.988518C25.3786 0.355581 24.5201 0 23.625 0H3.375C2.47989 0 1.62145 0.355581 0.988514 0.988518C0.355579 1.62146 0 2.4799 0 3.37501V4.00001H27Z"
                                      fill="#E6E9EB"
                                    />
                                    <path
                                      d="M0 6.99994V14.6666C0 15.5507 0.355579 16.3985 0.988514 17.0237C1.62145 17.6488 2.47989 18 3.375 18H23.625C24.5201 18 25.3786 17.6488 26.0115 17.0237C26.6444 16.3985 27 15.5507 27 14.6666V6.99994H0Z"
                                      fill="#E6E9EB"
                                    />
                                    <rect
                                      y="4.00012"
                                      width="27"
                                      height="3.00001"
                                      fill="#687282"
                                    />
                                    <path
                                      d="M4 11C4 10.4477 4.44772 10 5 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H5C4.44771 14 4 13.5523 4 13V11Z"
                                      fill="white"
                                    />
                                    <rect
                                      class="adyen-checkout__card__cvc__hint__location"
                                      x="16.5"
                                      y="9.5"
                                      width="7"
                                      height="5"
                                      rx="2.5"
                                      stroke="#C12424"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  class="adyen-checkout__button adyen-checkout__button--pay"
                  type="button"
                >
                  <span class="adyen-checkout__button__content"><img
                    class="adyen-checkout__button__icon"
                    src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/lock.svg"
                    alt=""
                    aria-hidden="true"
                  ><span class="adyen-checkout__button__text">Pay £15.94</span></span>
                </button>
              </div>
            </div>
          </li>
          <li class="adyen-checkout__payment-method DropinComponent-module_adyen-checkout__payment-method__nWdwg adyen-checkout__payment-method--paypal adyen-checkout__payment-method--credit paypal-3ff5b853-2413-48f1-a3cb-a55cef56ee7d ">
            <div class="adyen-checkout__payment-method__header">
              <button
                id="button-paypal-3ff5b853-2413-48f1-a3cb-a55cef56ee7d"
                class="adyen-checkout__payment-method__header__title"
                role="radio"
                type="button"
                aria-checked="false"
              >
                <span
                  class="adyen-checkout__payment-method__radio"
                  aria-hidden="true"
                /><span class="adyen-checkout__payment-method__image__wrapper DropinComponent-module_adyen-checkout__payment-method__image__wrapper__6NWzA adyen-checkout__payment-method__image__wrapper--outline"><img
                  class="adyen-checkout__payment-method__image DropinComponent-module_adyen-checkout__payment-method__image__nB80V adyen-checkout__image adyen-checkout__image--loaded"
                  src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/paypal.svg"
                  alt="PayPal"
                ></span><span class="adyen-checkout__payment-method__name">PayPal</span>
              </button>
            </div>
            <div
              id="container-paypal-3ff5b853-2413-48f1-a3cb-a55cef56ee7d"
              class="adyen-checkout__payment-method__details DropinComponent-module_adyen-checkout__payment-method__details__-rsW7"
              role="region"
              aria-labelledby="button-paypal-3ff5b853-2413-48f1-a3cb-a55cef56ee7d"
            />
          </li>
          <li class="adyen-checkout__payment-method DropinComponent-module_adyen-checkout__payment-method__nWdwg adyen-checkout__payment-method--googlepay adyen-checkout__payment-method--credit paywithgoogle-ba457938-6181-48b7-b553-9022f0807344 ">
            <div class="adyen-checkout__payment-method__header">
              <button
                id="button-paywithgoogle-ba457938-6181-48b7-b553-9022f0807344"
                class="adyen-checkout__payment-method__header__title"
                role="radio"
                type="button"
                aria-checked="false"
              >
                <span
                  class="adyen-checkout__payment-method__radio"
                  aria-hidden="true"
                /><span class="adyen-checkout__payment-method__image__wrapper DropinComponent-module_adyen-checkout__payment-method__image__wrapper__6NWzA"><img
                  class="adyen-checkout__payment-method__image DropinComponent-module_adyen-checkout__payment-method__image__nB80V adyen-checkout__image adyen-checkout__image--loaded"
                  src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/googlepay.svg"
                  alt="Google Pay"
                ></span><span class="adyen-checkout__payment-method__name">Google Pay</span>
              </button>
            </div>
            <div
              id="container-paywithgoogle-ba457938-6181-48b7-b553-9022f0807344"
              class="adyen-checkout__payment-method__details DropinComponent-module_adyen-checkout__payment-method__details__-rsW7"
              role="region"
              aria-labelledby="button-paywithgoogle-ba457938-6181-48b7-b553-9022f0807344"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// Stores
import { mapState, mapActions } from 'pinia';
import usePaymentStore from '@/stores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

import '@adyen/adyen-web/dist/adyen.css';

export default {
  name: 'AdyenDropIn',
  components: {
    Payment,
    TextField,
  },
  data() {
    return {
      errorMessage: '',
      orderId: null,
      storedPaymentsId: 'adyen-dropin-container-stored',
      adyenKey: 0,
      storedKey: 0,
      paymentStepText: '',
      paymentStepTextId: 'gene-bettercheckout-paymentstep-text',
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['loadingPaymentMethods']),
    ...mapState(useCartStore, ['cartEmitter']),
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
      'getSelectedShippingAddress',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale', 'adyenVaultEnabled']),
  },
  async created() {
    await this.getStoreConfig();
    this.paymentStepText = window.geneCheckout?.[this.paymentStepTextId] || this.$t('paymentStep.title');

    document.addEventListener(this.paymentStepTextId, this.setPaymentStepText);
  },
  unmounted() {
    document.removeEventListener(this.paymentStepTextId, this.setPaymentStepText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setPaymentStepText(event) {
      this.paymentStepText = event?.detail || this.$t('paymentStep.title');
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
