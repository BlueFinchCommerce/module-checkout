/* eslint-disable max-len */
export default {
  header: {
    text: 'Secure Checkout',
  },
  dividerText: 'Or checkout below with credit/debit card',
  signInDividerText: 'or',
  payNoExpressWithBlockTitle: 'Enter your email address to pay by credit or debit card',
  payWithBlockTitle: 'Pay With',
  orderSummary: {
    applyBtn: 'Apply',
    removeBtn: 'Remove',
    modalHeader: 'Order Summary',
    mobileDiscountText: 'Add gift card or promo code',
    backBtn: 'Back',
    grandTotalTitle: 'Total to Pay',
    inclTaxTitle: 'Tax',
    exclTaxTitle: 'Tax',
    discountTitle: 'Discount',
    subtotalTitle: 'Subtotal',
    removeItemButton: 'remove item',
    removeItemButtonLabel: 'remove item',
    minusOneItem: 'minus one item',
    plusOneItem: 'plus one item',
    couponDiscountTitle: 'Add promo code',
    couponDiscount: {
      title: 'Coupon',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter promo code',
      successMessage: 'Successfully applied code "{code}".',
    },
    giftDiscountTitle: 'Add gift card code',
    giftCardDiscount: {
      title: 'Gift card "{code}"',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter gift card code',
      successMessage: 'Successfully applied code "{code}".',
    },
    crossSellsTitle: 'You may also like these items...',
    freeShippingAvailable: 'Good news: your order will be delivered for Free.',
    couponCodeTitle: 'For another',
    couponCodeTitleBottom: 'you can get a',
    couponCodeTitleFreeShipping: 'free standard delivery',
    couponCode: {
      placeholder: 'Enter promotional code',
    },
    addToCart: 'Add to Basket',
    promoTitle: 'Complete your order with',
    rewardsTitle: 'Reward Points',
    storeCreditTitle: 'Store Credit',
    giftWrappingTitle: 'Gift Wrapping',
  },
  progressBar: {
    detailStepTitle: 'Details',
    shippingStepTitle: 'Shipping',
    paymentStepTitle: 'Payment',
  },
  yourDetailsSection: {
    title: 'Your details',
    selectPlaceholder: 'Please select your country',
    showPassLabel: 'Show or hide password',
    phoneField: {
      infoMessage: 'We will use this for delivery questions',
      placeholder: 'Enter your phone number',
      label: 'Phone number',
      info: 'We will use this for delivery questions',
    },
    emailAddress: {
      placeholder: 'Enter your email address',
      label: 'Email address',
      span: 'Email',
    },
    passwordField: {
      placeholder: 'Enter your password',
      label: 'Your Password',
    },
    firstName: {
      placeholder: 'First name',
      label: 'First name',
    },
    lastName: {
      placeholder: 'Last name',
      label: 'Last name',
    },
    clickAndCollectSection: {
      clickAndCollectTitle: 'Choose a Click & Collect Location',
      clickAndCollectInputPlaceholder: 'Search by postcode',
      clickAndCollectErrorMessage: 'Something went wrong while searching for locations. Please try again later.',
      clickAndCollectMoreLocations: 'Show more locations',
      clickAndCollectAddresses: 'Chosen Click & Collect Address:',
      clickAndCollectContinueButton: 'Continue To Payment',
      clickAndCollectFindButton: 'Find',
    },
    deliverySection: {
      toShippingButton: 'Choose your shipping method',
      title: 'Where should we deliver it to?',
      savedAddressesTitle: 'Select a saved {addressType} address',
      shipHere: 'Ship here',
      deliveryAddressTitle: 'Delivery Address',
      billingAddressTitle: 'Select a billing address',
      selectedBillingAddressTitle: 'Billing address',
      yourBillingAddress: 'Your billing address',
      newAddressTitle: 'Add new address',
      shippingButton: 'Home Delivery',
      clickandCollectButton: 'Click & Collect',
      clickandCollectToPaymentButton: 'Confirm Your Shipping Method',
      clickandCollectOpeningTimes: 'Opening Times',
      clickandCollectThresholdHigh: 'Click & Collect is currently unavailable. Please try another delivery method.',
      clickandCollectThresholdLow: 'Click & Collect is currently unavailable. Please try another delivery method.',
      clickandCollectThresholdHighWeight: 'Click & Collect is currently unavailable. Please try another delivery method.',
      clickandCollectThresholdLowWeight: 'Click & Collect is currently unavailable. Please try another delivery method.',

      addressFinder: {
        title: 'Address Finder',
        placeholder: 'Search by street name or postcode',
        label: 'Street name/postcode',
      },
      addressForm: {
        saveAddressButton: 'Use this address',
        linkText: 'Enter your address manually',
        useMyLocation: 'Use My Location',
        collectLocations: 'Where would you like to collect it?',
        closestLocations: 'Nearest Collection Locations',
        noLocations: 'No locations found for current search.',
        collectionName: 'Who is collecting the order?',
        collectionBillingTitle: 'Billing Details',
        submitCollectionDetails: 'Submit collection details',
        collectionDistance: '{distance} miles',
        viewMapAndHours: 'View map and opening hours',
        selectLocation: 'SELECT LOCATION',
        addressField: {
          placeholder: 'Address (line {line})',
          label: 'Address (line {line})',
        },
        cityField: {
          label: 'City',
          placeholder: 'City',
        },
        countryField: {
          label: 'Country',
          placeholder: 'Country',
        },
        postCodeField: {
          label: 'Postcode',
          placeholder: 'Postcode',
        },
        regionField: {
          label: 'County',
          placeholder: 'County',
        },
      },
    },
    editButton: 'Edit',
    editDetailsButtonLabel: 'Edit Your Details',
    editShippingButtonLabel: 'Edit Your Shipping Details',
  },
  errorMessages: {
    addressWrongError: 'Please check your address format.',
    sanitiseError: 'Invalid character entered',
    firstNameErrorMessage: 'Please enter a valid first name',
    lastNameErrorMessage: 'Please enter a valid last name',
    emailErrorMessage: 'Please enter a valid email address',
    phoneErrorMessage: 'Not a valid Phone Number',
    passwordHelpText: 'Minimum 8 characters and must include at least three character classes '
        + '(lowercase letter, uppercase letter, number or special characters).',
    passwordErrorMessage: 'Please enter a valid password',
    addressFormErrorMessage: 'Please make sure that all required fields are filled',
    postCodeErrorMessage: 'Please enter a valid postcode for',
    countryErrorMessage: 'Please choose your country',
    streetErrorMessage: 'Please enter a valid address',
    streetCharacterLimit: 'Please use a maximum of 75 characters for your street address',
    cityErrorMessage: 'Please enter a valid city',
    regionErrorMessage: 'Please enter a valid state/province',
    googlePayShippingError: 'The shipping method is missing. Please select the shipping method and try again.',
    googlePayNominatedDayError: 'Unfortunately we cannot offer Express Payment on orders with Nominated Day Delivery.',
    noShippingMethods: 'No shipping methods found for the selected address.',
    googlePayNoShippingMethods: 'No shipping methods found for the selected address.',
    unexpectedPaymentError: 'An unexpected error occurred',
    applePayNoShippingMethods: 'No shipping methods found for the selected address.',
    postcodeLookup: 'Unable to get your location.',
    rvvupPayment: {
      cancelled: 'Payment Cancelled.',
      unexpected: 'An error occurred while processing your payment. Please contact us.',
      declined: 'Payment Declined.',
      other: 'An error occurred while processing your payment. Please contact us.',
      expired: 'Payment Expired.',
      failed: 'Payment Failed.',
      qtyNotAvailable: 'The requested qty is not available.',
    },
  },
  welcomeMessages: {
    accountBody: 'Sign in to your account to checkout or continue as a guest.',
    accountTitle: 'Welcome back!',
    getStarted: 'Enter your email to get started.',
    guestBody: "Looks like you're new here! Continue to checkout as a guest with the option to create an account once you've placed your order.",
    guestTitle: 'Hello',
  },
  signInButton: 'Sign In',
  noAccountGuestButton: 'Continue as a Guest',
  accountGuestButton: 'Continue as a Guest',
  continueButton: 'Continue',
  forgotPass: 'Forgot your Password',
  updateButton: 'Update',
  billingForm: {
    notSameAddress: 'My billing and shipping address are the same',
  },
  shippingStep: {
    proceedToPay: 'Proceed to payment',
    stepTitle: 'Select a shipping method',
    stepCompleteTitle: 'Shipping',
    nominatedDelivery: 'Choose a day that suits you.',
    nominatedDeliveryCalendar: 'Please select a date',
    specifiedDayDeliveryTitle: 'Specified Date',
    specifiedDayDeliveryDescription: 'Choose a day that suits you',
    specifiedDayDeliveryDetails: 'Deliveries made',
    specifiedDayCalendar: 'Your order will be delivered on',
    tbc: 'Calculated at next step',
    deliveryInstructions: {
      title: 'Delivery Instructions?',
      label: 'Courier instructions',
      info: 'If no one is at home to accept delivery, our drivers will automatically try a neighbour & leave a card. Alternatively, please specify delivery instructions here.',
      placeholder: 'Eg. Leave on front porch',
      maxCharacters: '{remainingCharacters} remaining characters',
    },
  },
  addNewAddressBtn: '+ Add new address',
  saveNewAddress: 'Save in address book',
  paymentStep: {
    titleGuest: 'Select a payment method',
    titleStored: 'Your saved payment methods',
    titleNew: 'Select new payment method',
    freePaymentLabel: 'No Payment Information Required',
    checkMOLabel: 'Check / Money Order',
    payNow: 'Pay Now',
    storedPayments: 'Your Saved Payments',
    creditDebitCard: 'Credit or debit card',
  },
  productOptionsTrigger: 'Product options',
  instantCheckout: 'Instant Checkout',
  adyen: {
    applePayTotal: 'Grand Total',
    applePayNoShippingMethods: 'There are no shipping methods available for you right now. Please try again or use an alternative payment method.',
    paymentSuccessful: 'Payment Successful',
  },
  paymentCard: {
    cardNumber: 'Card Number',
    expiry: 'Expiry',
    select: 'Select',
    storedPaymentLabel: '{name} Stored card ends in {lastFour}',
  },
  braintree: {
    payingWith: 'Paying with {paymentTitle}',
    ach: {
      accountNumber: 'Account Number',
      accountType: 'Account Type',
      businessName: 'Business Name',
      firstname: 'First Name',
      lastname: 'Last Name',
      ownershipType: 'Ownership Type',
      payment: 'ACH Payment',
      proof: 'Proof of Authorization',
      routingNumber: 'Routing Number',
      terms: 'By clicking "Pay with ACH", I authorize Braintree, a service of PayPal on behalf of {websiteName} (i) to verify my bank account information using bank information and consumer reports and (ii) to debit my bank account.',
    },
    lpm: {
      noMethods: 'There are currently no available payment methods. Please update your Billing Address.',
    },
    storePayment: 'Save for later use.',
  },
  rvvup: {
    payByBankLabel: 'Pay by Bank',
    payByBankButton: 'Continue to Pay by Bank with Rvvup',
    rvvupPaymentLabel: 'Rvvup Pay By Bank',
  },
  superPayments: {
    superPaymentsTitle: 'Pay with Bank App via Super Payments',
  },
  agreements: {
    acceptBtn: 'Accept',
    title: 'Terms & Conditions',
    label: {
      manual: 'I confirm that I have read and accept the',
      automatic: 'By placing an order you accept our',
    },
    errorMessage: 'This is a required field.',
    paymentErrorMessage: 'Agreements have not been accepted. Please check the agreements and try again.',
  },
  privacyPolicy: {
    content: 'Your data will be handled as set out in our ',
    link: 'Privacy Policy',
  },
  termsServices: {
    content: 'By clicking on the "order now" button, you hereby agree to our ',
    generalLink: 'General Terms & Conditions, ',
    privacyLink: ' our Privacy Policy',
    withdrawLink: 'and our Withdrawal Policy.',
  },
  newsletter: {
    label: 'Subscribe to the newsletter',
  },
  rewards: {
    applied: 'Reward points have been applied.',
    applyButton: 'Apply Points',
    available: ' available ',
    removeButton: 'Remove Points',
    rewardPoints: '{points} Reward Points',
    youHave: 'You have ',
  },
  storeCredit: {
    applyStoreCredit: 'You have {value} in store credit available.',
    applyButton: 'Use store credit',
    removeStoreCredit: 'Store credit has been used.',
    removeButton: 'Remove store credit',
  },
  payWith: {
    masterCard: 'pay with master card',
    visa: 'pay with visa',
    americanExpress: 'pay with american express',
    clearPay: 'pay with clear pay',
    klarna: 'pay with klarna',
  },
  giftMessage: {
    to: 'To',
    from: 'From',
    message: 'Message',
  },
  days: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
};
