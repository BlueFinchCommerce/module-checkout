<template>
  <section class="customer-form">
    <template v-if="loadingLogin">
      <div class="loader__absolute-container">
        <Loader/>
      </div>
    </template>

    <div class="checkout-section checkout-email">
      <template v-if="emailRegistered !== undefined && !isLoggedIn && !emailEntered">
        <TextField
          class="welcome-message-title"
          data-cy="email"
          :text="emailRegistered ?
            $t('welcomeMessages.accountTitle') : $t('welcomeMessages.guestTitle')"
        />
        <TextField
          class="welcome-message"
          :text="emailRegistered ?
            $t('welcomeMessages.accountBody') : $t('welcomeMessages.guestBody')"
        />
      </template>

      <div :class="{ 'logged-in-email': isLoggedIn }">
        <TextInput
          ref="email"
          v-model="customer.email"
          :error="emailError"
          data-cy="email"
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
        <div
          v-if="emailEntered && !isLoggedIn"
          class="email-address-edit-btn"
          @click="changeEmail()"
          @keydown.enter="changeEmail()"
        >
          <button class="edit-button"
                  data-cy="button"
                  :aria-label="$t('yourDetailsSection.editDetailsButtonLabel')">
            <TextField
              :text="$t('yourDetailsSection.editButton')"
              font-weight="400"
              font-size="12px"
            />
            <Edit />
          </button>
        </div>
      </div>

      <div>
        <MyButton
          v-if="emailRegistered === undefined && !emailEntered"
          class="continue-btn"
          primary
          :label="continueButtonText"
          @click="emailAddressChange()"
        />
      </div>

      <div v-if="emailRegistered && !emailEntered">
        <div class="field__password">
          <TextInput
            v-model="password"
            :error="passwordError"
            :error-message="passwordErrorMessage"
            :type="passwordInputType"
            data-cy="password"
            identifier="password"
            :label="$t('yourDetailsSection.passwordField.label')"
            :placeholder="$t('yourDetailsSection.passwordField.placeholder')"
            required
          >
            <template #icon>
              <button
                class="button_show_password"
                :aria-label="$t('yourDetailsSection.showPassLabel')"
                @click="toggleShowPassword"
              >
                <span v-if="showPassword">
                  <ShowIcon />
                </span>
                <span v-else>
                  <HideIcon />
                </span>
              </button>
            </template>
          </TextInput>
        </div>

        <div id="password_help_text">
          <TextField
            class="field__help-text"
            :text="$t('errorMessages.passwordHelpText')"
            font-weight="300"
            font-size="12px"
          />
        </div>

        <ErrorMessage
          v-if="loginErrorMessage"
          :message="loginErrorMessage"
        />

        <div class="checkout-email__footer">
          <a
            :href="baseURL + '/customer/account/forgotpassword/'"
            class="forgot-pass"
            data-cy="forgot-pass-button"
          >
            <span style="display: none">forgotPass link</span>
            <TextField
              :text="$t('forgotPass')"
              font-weight="300"
              font-size="14px"
            />
          </a>
        </div>

        <div
          v-if="!emailEntered"
          class="actions"
        >
          <MyButton
            type="submit"
            class="sign-in-btn"
            primary
            :label="$t('signInButton')"
            @click="submitForm"
          />
          <MyButton
            class="guest-btn"
            secondary
            :disabled="proceedAsGuestInvalid"
            :label="$t('accountGuestButton')"
            @click="proceed();"
          />
        </div>
      </div>

      <div
        v-if="emailRegistered === false && !emailEntered"
        class="actions"
      >
        <MyButton
          class="guest-btn"
          secondary
          :disabled="proceedAsGuestInvalid"
          :label="$t('noAccountGuestButton')"
          @click="proceed();"
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
import useConfigStore from '@/stores/ConfigStore';
import useGtmStore from '@/stores/GtmStore';

// components
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/Button/Button.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';

// icons
import ShowIcon from '@/components/Core/Icons/ShowIcon/ShowIcon.vue';
import HideIcon from '@/components/Core/Icons/HideIcon/HideIcon.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import Loader from '@/components/Core/Loader/Loader.vue';

// helpers
import getBaseUrl from '@/helpers/getBaseUrl';
import isEmailValid from '@/helpers/isEmailValid';
import scrollToTarget from '@/helpers/scrollToTarget';

export default {
  name: 'EmailAddress',
  components: {
    TextInput,
    MyButton,
    HideIcon,
    ShowIcon,
    TextField,
    ErrorMessage,
    Loader,
    Edit,
  },
  data() {
    return {
      emailError: false,
      // emailRegistered has three states - Undefined, false, true. Undefined is for unknown state.
      emailRegistered: undefined,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      passwordError: false,
      loginErrorMessage: null,
      showPassword: false,
      passwordValid: false,
      loadingLogin: false,
      baseURL: getBaseUrl(),
      isEmailAvailableRequest: undefined,
      continueButtonText: '',
      continueButtonTextId: 'gene-bettercheckout-continuebutton-text',
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['isLoggedIn', 'emailEntered']),
    ...mapWritableState(useCustomerStore, ['customer']),
    ...mapState(useCartStore, ['guestCheckoutEnabled']),
    proceedAsGuestInvalid() {
      return this.emailError;
    },
    passwordInputType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  async mounted() {
    await this.getStoreConfig();
    await this.getCartData();
    await this.getCart();
    this.trackStep({
      step: 1,
      description: 'login',
    });
    this.continueButtonText = window.geneCheckout?.[this.continueButtonTextId] || this.$t('continueButton');
  },
  methods: {
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, [
      'login',
      'submitEmail',
      'isEmailAvailable',
      'editEmail',
    ]),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'emitUpdate']),
    ...mapActions(useGtmStore, ['trackStep']),

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
        this.proceed();
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

      this.loadingLogin = true;
      await this.loginAndProceed();
      this.emitUpdate();
      this.loadingLogin = false;
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

    proceed() {
      this.submitEmail();
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

    emailAddressBlur() {
      // On blur validate the email and show error if invalid.
      if (!isEmailValid(this.customer.email.toLowerCase())) {
        // Set the error messages if the length is greater than 0.
        this.setEmailErrorState(this.customer.email.length > 0);
      }
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
        this.emailRegistered = undefined;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
