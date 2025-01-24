<template>
  <section class="customer-form">
    <div class="checkout-section checkout-email">
      <template v-if="emailRegistered !== undefined && !isLoggedIn && !emailEntered">
        <TextField
          class="welcome-message-title"
          :data-cy="'welcome-message-title'"
          :text="emailRegistered ?
            $t('welcomeMessages.accountTitle') : $t('welcomeMessages.guestTitle')"
        />
        <TextField
          class="welcome-message"
          :data-cy="'welcome-message'"
          :text="emailRegistered ?
            $t('welcomeMessages.accountBody') : $t('welcomeMessages.guestBody')"
        />
      </template>

      <div :class="{ 'logged-in-email': isLoggedIn }">
        <TextInput
          ref="email"
          v-model="customer.email"
          :error="emailError"
          :class="{ 'field-valid': emailValid && !emailEntered && !emailError && !inputsSanitiseError}"
          :data-cy="isLoggedIn ? 'logged-in-email' : 'email-input'"
          :error-message="emailErrorMessage"
          identifier="email"
          :label="$t('yourDetailsSection.emailAddress.label')"
          :placeholder="$t('yourDetailsSection.emailAddress.placeholder')"
          :required="!isLoggedIn"
          autocomplete="email"
          type="email"
          :disabled="emailEntered"
          @blur="emailAddressBlur"
          @keyup="emailAddressChange"
        />
        <ValidIcon v-if="emailValid && !emailEntered && !emailError && !inputsSanitiseError"/>
        <ErrorIcon v-if="(emailError || inputsSanitiseError) && !emailEntered"/>

        <div
          v-if="emailEntered && !isLoggedIn"
          class="email-address-edit-btn"
          :class="inputsSanitiseError ? 'disabled' : ''"
          @click="changeEmail()"
          @keydown.enter="changeEmail()"
        >
          <button class="edit-button"
                  data-cy="edit-email-button"
                  :aria-label="$t('yourDetailsSection.editDetailsButtonLabel')">
            <TextField
              :text="$t('yourDetailsSection.editButton')"
              :data-cy="'edit-email-button-text'"
            />
            <Edit :data-cy="'edit-email-button-icon'"/>
          </button>
        </div>
        <component
          :is="belowEmailFieldExtension"
          v-for="belowEmailFieldExtension in belowEmailFieldExtensions"
          :key="belowEmailFieldExtension"
        />
      </div>

      <div>
        <MyButton
          v-if="emailRegistered === undefined && !emailEntered"
          class="continue-btn"
          primary
          :label="continueButtonText"
          @click="emailAddressChange()"
          :data-cy="'continue-button'"
        />
      </div>

      <div v-if="emailRegistered && !emailEntered">
        <div class="field__password">
          <TextInput
            v-model="password"
            :error="passwordError"
            :error-message="passwordErrorMessage"
            :type="passwordInputType"
            :data-cy="'password-input'"
            identifier="password"
            :label="$t('yourDetailsSection.passwordField.label')"
            :placeholder="$t('yourDetailsSection.passwordField.placeholder')"
            ref="passwordInput"
            required
          >
            <template #icon>
              <button
                class="button_show_password"
                :aria-label="$t('yourDetailsSection.showPassLabel')"
                @click="toggleShowPassword"
                :data-cy="'show-password-button'"
              >
                <span v-if="showPassword">
                  <ShowIcon :data-cy="'show-passowrd-icon'" />
                </span>
                <span v-else>
                  <HideIcon :data-cy="'hide-passowrd-icon'"/>
                </span>
              </button>
            </template>
          </TextInput>
        </div>

        <div class="checkout-email__footer">
          <a
            :href="baseURL + '/customer/account/forgotpassword/'"
            class="forgot-pass"
            data-cy="forgot-password-link"
          >
            <span style="display: none">forgotPass link</span>
            <TextField
              :text="$t('forgotPass')"
              :data-cy="'forgot-password-link-text'"
            />
          </a>
        </div>

        <div
          v-if="!emailEntered"
          class="actions"
        >
          <Recaptcha
            id="customerLogin"
            location="emailAddress"
          />

          <ErrorMessage
            v-if="loginErrorMessage"
            :message="loginErrorMessage"
            :attached="false"
          />

          <MyButton
            type="submit"
            class="sign-in-btn"
            primary
            :label="signInButtonText"
            :data-cy="'sign-in-button'"
            @click="submitForm"
          />
          <div class="divider">
            <div class="divider-line"></div>
            <TextField
              :text="$t('signInDividerText')"
              :data-cy="'sign-in-divider-text'"
            />
            <div class="divider-line"></div>
          </div>
          <MyButton
            class="guest-btn"
            secondary
            :disabled="proceedAsGuestInvalid"
            :label="accountGuestButtonText"
            :data-cy="'guest-continue-button'"
            @click="proceedAsGuest();"
          />
        </div>
      </div>

      <div
        v-if="emailRegistered === false && !emailEntered"
        class="actions"
      >
        <MyButton
          class="guest-btn single"
          secondary
          :disabled="proceedAsGuestInvalid"
          :label="noAccountGuestButtonText"
          :data-cy="'guest-continue-button-no-account'"
          @click="proceedAsGuest();"
        />
      </div>
    </div>
  </section>
</template>

<script>
// Stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useLoadingStore from '@/stores/LoadingStore';

// components
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';

// icons
import ShowIcon from '@/components/Core/Icons/ShowIcon/ShowIcon.vue';
import HideIcon from '@/components/Core/Icons/HideIcon/HideIcon.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';
import ErrorIcon from '@/components/Core/Icons/ErrorIcon/ErrorIcon.vue';

// Extensions
import belowEmailFieldExtensions from '@/extensions/belowEmailFieldExtensions';

// helpers
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import isEmailValid from '@/helpers/validation/isEmailValid';
import scrollToTarget from '@/helpers/scrollToTarget';
import customerLoginDataLayer from '@/helpers/dataLayer/customerLoginDataLayer';
import continueAsGuestDataLayer from '@/helpers/dataLayer/continueAsGuestDataLayer';

// extensions
import functionExtension from '@/extensions/functionExtension';

export default {
  name: 'EmailAddress',
  components: {
    ErrorIcon,
    TextInput,
    MyButton,
    HideIcon,
    ShowIcon,
    ValidIcon,
    TextField,
    ErrorMessage,
    Edit,
    Recaptcha,
    ...belowEmailFieldExtensions(),
  },
  data() {
    return {
      emailError: false,
      // emailRegistered has three states - Undefined, false, true. Undefined is for unknown state.
      emailRegistered: undefined,
      emailErrorMessage: '',
      emailValid: false,
      passwordErrorMessage: '',
      passwordError: false,
      loginErrorMessage: null,
      showPassword: false,
      passwordValid: false,
      password: '',
      baseURL: getBaseUrl(),
      isEmailAvailableRequest: undefined,
      continueButtonText: '',
      continueButtonTextId: 'bluefinch-checkout-continuebutton-text',
      noAccountGuestButtonText: '',
      noAccountGuestButtonTextId: 'bluefinch-checkout-noaccountguestbutton-text',
      signInButtonText: '',
      signInButtonTextId: 'bluefinch-checkout-signinbutton-text',
      accountGuestButtonText: '',
      accountGuestButtonTextId: 'bluefinch-checkout-accountguestbutton-text',
      tabKeyPressed: false,
      belowEmailFieldExtensions: [],
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['isLoggedIn', 'emailEntered', 'inputsSanitiseError']),
    ...mapWritableState(useCustomerStore, ['customer']),
    ...mapState(useCartStore, ['guestCheckoutEnabled']),
    ...mapState(useConfigStore, ['storeCode']),
    proceedAsGuestInvalid() {
      return this.emailError || this.customer.email.length === 0;
    },
    passwordInputType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  async mounted() {
    this.continueButtonText = window.bluefinchCheckout?.[this.continueButtonTextId] || this.$t('continueButton');
    this.noAccountGuestButtonText = window.bluefinchCheckout?.[this.noAccountGuestButtonTextId]
      || this.$t('noAccountGuestButton');
    this.signInButtonText = window.bluefinchCheckout?.[this.signInButtonTextId] || this.$t('signInButton');
    this.accountGuestButtonText = window.bluefinchCheckout?.[this.accountGuestButtonTextId]
      || this.$t('accountGuestButton');

    await this.getInitialConfig();
    await this.getCart();

    this.trackStep({
      step: 1,
      description: 'login',
    });
    document.addEventListener('keydown', this.handleKeyDown);
  },
  created() {
    this.belowEmailFieldExtensions = Object.keys(belowEmailFieldExtensions());
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, [
      'login',
      'submitEmail',
      'setEmailEntered',
      'isEmailAvailable',
      'editEmail',
    ]),
    ...mapActions(useCartStore, ['getCart', 'emitUpdate']),
    ...mapActions(useGtmStore, ['trackStep']),
    ...mapActions(useLoadingStore, ['setLoadingState']),

    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    changeEmail() {
      this.editEmail();
      setTimeout(() => {
        this.$refs.email.$refs.input.focus();
      }, 0);
    },

    async loginAndProceed() {
      try {
        await this.login(this.customer.email, this.password);
        this.loginErrorMessage = '';
        await this.proceed();
        customerLoginDataLayer();
      } catch (error) {
        this.loginErrorMessage = error.message;
      }
    },

    async submitForm() {
      scrollToTarget('.details-form');
      // Validate the User's password.
      this.loginErrorMessage = '';
      this.validatePassword();

      // If there is any error then early return.
      if (this.emailError || this.passwordError) return;

      this.setLoadingState(true);
      await this.loginAndProceed();
      this.emitUpdate();
      this.setLoadingState(false);
    },

    validatePassword() {
      this.passwordValid = false;
      let counter = 0;
      const requiredNumber = 3;

      /* eslint-disable no-plusplus */
      if (/[0-9]+/.test(this.password)) counter++;
      if (/[A-Z]+/.test(this.password)) counter++;
      if (/[a-z]+/.test(this.password)) counter++;
      if (/[^a-zA-Z0-9]+/.test(this.password)) counter++;

      this.passwordValid = counter >= requiredNumber;

      if (this.passwordValid === false) {
        this.passwordError = true;
        this.passwordErrorMessage = this.$t('errorMessages.passwordErrorMessage');
      } else {
        this.passwordError = false;
        this.passwordErrorMessage = '';
      }
    },

    async proceedAsGuest() {
      continueAsGuestDataLayer();
      await this.proceed();
    },

    async proceed() {
      this.setEmailEntered();
      this.submitEmail(this.customer.email);
      await functionExtension('onUserProceed', [
        this.customer.email,
      ]);
    },

    /**
     * Sets the states for the email address input field.
     *
     * @param {Boolean} hasError
     */
    setEmailErrorState(hasError) {
      this.emailError = hasError;
      this.emailErrorMessage = hasError ? this.$t('errorMessages.emailErrorMessage') : '';
    },

    handleKeyDown(event) {
      if (event.key === 'Tab') {
        this.tabKeyPressed = true;
      }
    },

    emailAddressBlur() {
      // On blur validate the email and show error if invalid.
      if (!isEmailValid(this.customer.email.toLowerCase())) {
        // Set the error messages if the length is greater than 0.
        this.setEmailErrorState(this.customer.email.length > 0);
      } else {
        this.emailValid = true;

        // If focus was lost due to a Tab key press and email
        // is valid, and focus hasn't returned to email yet, focus back on the email field
        if (this.tabKeyPressed && this.emailValid && !this.focusReturnedToEmail) {
          this.$refs.email.$refs.input.focus();
          this.focusReturnedToEmail = true; // Update the flag to indicate that focus has returned to email field
        }
      }

      // Reset the flag for Tab key press
      this.tabKeyPressed = false;
    },

    async emailAddressChange() {
      // On changing the email address we must be focused on the element so
      // hide the error.
      this.setEmailErrorState(false);

      // Validate the email address.
      if (isEmailValid(this.customer.email.toLowerCase())) {
        this.emailRegistered = !await this.isEmailAvailable(this.customer.email);
      } else {
        // If the email is not valid then set to undefined as we don't know.
        this.emailRegistered = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
