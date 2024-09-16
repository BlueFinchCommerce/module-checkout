/* eslint-disable max-len */
export default {
  header: {
    text: 'Sikker bestilling',
  },
  dividerText: 'Eller indtast din e-mailadresse for betaling med kredit- eller betalingskort',
  signInDividerText: 'or',
  payNoExpressWithBlockTitle: 'Indtast din e-mailadresse for betaling med kredit- eller betalingskort',
  orderSummary: {
    applyBtn: 'Anvend',
    removeBtn: 'Fjern',
    modalHeader: 'Bestillingsoversigt',
    mobileDiscountText: '',
    backBtn: 'Tilbage',
    grandTotalTitle: 'Pris i alt',
    inclTaxTitle: 'Moms',
    exclTaxTitle: 'plus moms',
    discountTitle: 'Rabat',
    subtotalTitle: 'Subtotal',
    removeItemButton: 'Fjern',
    removeItemButtonLabel: 'Fjern artikel',
    minusOneItem: 'minus en artikel',
    plusOneItem: 'plus en artikel',
    crossSellsTitle: 'You may also like these items...',
    couponDiscountTitle: 'Add promo code',
    couponDiscount: {
      title: 'Coupon',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter promo code',
      successMessage: 'Successfully applied code "{code}".',
    },
    giftDiscountTitle: 'Indtast Promo kode',
    giftCardDiscount: {
      title: 'Gift card "{code}"',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Indtast kode',
      successMessage: 'koden er indtastet "{code}".',
    },
    couponCodeTitle: 'Bestil for yderligere',
    couponCodeTitleBottom: 'for en',
    couponCodeTitleFreeShipping: 'gratis forsendelse',
    couponCode: {
      placeholder: 'Indtast koden',
    },
    addToCart: 'Læg i indkøbskurv',
    promoTitle: 'Afslut din ordre med...',
    closeButton: 'Luk ordreoversigten',
    mixedShipping: 'Dette vil blive leveret separat',
    heliumItem: 'Leveres oppustet',
    skuNumber: 'SKU nr:',
    supplierStockNumber: 'Leverandørens lager nr:',
    storeCreditTitle: 'Store Credit',
    giftWrappingTitle: 'Gift Wrapping',
  },
  progressBar: {
    detailStepTitle: 'Dine oplysninger',
    shippingStepTitle: 'Forsendelse',
    paymentStepTitle: 'Betaling',
  },
  yourDetailsSection: {
    title: 'Dine oplysninger',
    selectPlaceholder: 'Vælg venligst et land',
    showPassLabel: 'Vis eller skjul adgangskode',
    phoneField: {
      infoMessage: 'Vi vil kun bruge dette nummer til at kontakte dig angående din levering.',
      placeholder: 'Indtast telefonnummer',
      label: 'Telefonnummer',
      info: 'We will use this for delivery questions',
    },
    emailAddress: {
      placeholder: 'Indtast e-mail-adresse',
      label: 'E-mail-adresse',
      span: 'E-mail',
    },
    passwordField: {
      placeholder: 'Indtast adgangskode',
      label: 'Din adgangskode',
    },
    firstName: {
      placeholder: 'Indtast fornavn',
      label: 'Fornavn',
    },
    lastName: {
      placeholder: 'Indtast efternavn',
      label: 'Efternavn',
    },
    deliverySection: {
      toShippingButton: 'Vælg forsendelsesmetoder',
      title: 'Leveringsadresse',
      savedAddressesTitle: 'Vælg din gemte leveringsadresse',
      shipHere: 'Send her',
      info: 'Hvor skal vi sende til?',
      billingAddressTitle: 'Faktureringsadresse',
      selectedBillingAddressTitle: 'Billing address',
      yourBillingAddress: 'Your billing address',
      newAddressTitle: 'Add new address',
      deliveryAddressTitle: 'Leveringsadresse',
      addressFinder: {
        title: 'Søg efter adresse',
        placeholder: 'Søg efter gade eller postnummer',
        label: 'Gade eller postnummer',
      },
      addressForm: {
        saveAddressButton: 'Brug denne adresse',
        linkText: 'Indtast adresse manuelt',
        addressField: {
          placeholder: 'Indtast første adresselinje',
          unrequired: 'Indtast adresse (linje 2)',
          label: 'Første adresselinje',
          unrequiredLabel: 'Adresse (linje 2)',
        },
        cityField: {
          label: 'By',
          placeholder: 'Indtast by',
        },
        countryField: {
          label: 'Land',
          placeholder: 'Indtast land',
        },
        postCodeField: {
          label: 'Postnummer',
          placeholder: 'Indtast postnummer',
        },
        regionField: {
          label: 'Region',
          placeholder: 'Indtast region',
        },
      },
    },
  },
  editButton: 'Ændre',
  editButtonLabel: 'Ændre e-mailadresse',
  editDetailsButtonLabel: 'Ændre oplysninger',
  editShippingButtonLabel: 'Ændre forsendelsesoplysninger',
  errorMessages: {
    addressWrongError: 'Please check your address format.',
    sanitiseError: 'Ungültiges Zeichen eingegeben.',
    firstNameErrorMessage: 'Indtast venligst et gyldigt fornavn',
    lastNameErrorMessage: 'Indtast venligst et gyldigt efternavn',
    emailErrorMessage: 'Indtast venligst en gyldig e-mailadresse',
    phoneErrorMessage: 'Intet gyldigt telefonnummer',
    passwordHelpText: 'Skal indeholde mindst 8 tegn og mindst 3 tegntyper',
    passwordErrorMessage: 'Indtast venligst en gyldig e-mailadresse og adgangskode',
    addressFormErrorMessage: 'Sørg for, at alle obligatoriske felter er udfyldt',
    postCodeErrorMessage: 'Indtast venligst et gyldigt postnummer for',
    countryErrorMessage: 'Vælg venligst land',
    streetErrorMessage: 'Indtast en gyldig adresse, og brug højst 75 tegn',
    cityErrorMessage: 'Indtast venligst en gyldig by',
    regionErrorMessage: 'Indtast venligst gyldigt land',
    googlePayShippingError: 'Ingen forsendelsesmetoder valgt. Vælg forsendelsesmetoder, og prøv igen.',
    googlePayNominatedDayError: 'Vi kan desværre ikke tilbyde ekspresbetaling på ordrer med ønsket leveringsdato.',
    oosErrorMessage: 'Varen er udsolgt',
    noShippingMethods: 'Ingen forsendelsesmetoder fundet for den valgte adresse',
    googlePayNoShippingMethods: 'Ingen forsendelsesmetoder fundet for den valgte adresse',
    unexpectedPaymentError: 'Der opstod en uventet fejl',
  },
  welcomeMessages: {
    accountBody: 'Log ind med kundekonto eller fortsæt som gæst',
    accountTitle: 'Velkommen tilbage!',
    getStarted: 'Indtast e-mail for at starte',
    guestBody: 'Det ser ud til, at du er ny her! Fortsæt din bestilling som gæst; du har mulighed for at oprette en konto, når du har gennemført din bestilling.',
    guestTitle: 'Hej med dig',
  },
  signInButton: 'Log ind',
  noAccountGuestButton: 'Fortsæt som gæst',
  accountGuestButton: 'Eller fortsæt som gæst',
  continueButton: 'Fortsæt',
  forgotPass: 'Har du glemt din adgangskode?',
  updateButton: 'Opdatering',
  billingForm: {
    notSameAddress: 'Min fakturerings- og leveringsadresse er den samme',
  },
  shippingStep: {
    proceedToPay: 'Fortsæt til betaling',
    stepTitle: 'Vælg forsendelsesmetode',
    stepCompleteTitle: 'Forsendelse',
    stepTitleSubText: 'Vælg forsendelsesmetode',
    nominatedDelivery: 'Vælg den ønskede dato',
    tbc: 'Beregnes i næste trin',
    methodLabel: 'Modtaget af',
    noDeliveryDate: 'Vælg leveringsdato',
  },
  addNewAddressBtn: 'Tilføj ny adresse',
  saveNewAddress: 'Gem i adressebogen',
  paymentStep: {
    titleGuest: 'Vælg betalingsmetode',
    titleStored: 'Your saved payment methods',
    titleNew: 'Select new payment method',
    freePayment: 'Ingen betalingsoplysninger påkrævet',
    payNow: 'Betal nu',
    storedPayments: 'Dine gemte betalinger',
    creditDebitCard: 'Kredit- eller betalingskort',
  },
  productOptionsTrigger: 'Artikeloption',
  instantCheckout: 'Hurtig betaling',
  checkoutTitle: 'Bestilling',
  adyen: {
    applePayTotal: 'Pris i alt',
    applePayNoShippingMethods: 'Der er i øjeblikket ingen forsendelsesmetoder tilgængelige for dig. Prøv igen eller brug en anden betalingsmetode',
  },
  paymentCard: {
    cardNumber: 'Kortnummer',
    expiry: 'Udløbsdato',
    select: 'Select',
    storedPaymentLabel: '{name} Gemt kort udløber den {lastFour}.',
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
  agreements: {
    acceptBtn: 'Accept',
    title: 'Terms & Conditions',
    label: 'Jeg accepterer',
    errorMessage: 'Dette er et påkrævet felt',
  },
  privacyPolicy: {
    content: 'Du kan læse om, hvordan vi håndterer dine data i vores',
    link: 'Privatlivspolitik',
  },
  termsServices: {
    content: 'Med din ordre, du fortæller dig selv med vores vilkår',
    generalLink: 'og Handelsbetingelser, ',
    privacyLink: 'Databeskyttelsepolitik',
    withdrawLink: 'og tilbagekaldelse enige.',
  },
  newsletter: {
    label: 'Tilmeld dig nyhedsbrevet',
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
  donation: {
    donateText: 'Donér',
    removeDonation: 'Fjern donation',
    donateTitle: 'Donér dine cent',
    charityLogo: 'Velgørenhed Logo',
    penniesLogo: 'Pennies Logo',
  },
  payWith: {
    masterCard: 'Betal med Master Card',
    visa: 'Betal med Visa',
    paypal: 'Betal med PayPal',
    clearPay: 'Betal med Clearpay',
    klarna: 'Betal med Klarna',
  },
  giftMessage: {
    to: 'Til',
    from: 'Fra',
    message: 'Besked',
  },
  inflatableBalloons: {
    title: 'Levering af balloner',
    description: 'Din(e) oppustede ballon(er) vil blive leveret på den dato, der er valgt nedenfor, alle andre varer i din ordre vil blive leveret i henhold til din valgte leveringsmetode.',
    openBtnText: 'Vælg en leveringsdag.',
    savedMethod: 'Levering af oppustede balloner.',
    message: '* Den dag, du valgte, er ikke længere tilgængelig. Vælg venligst en anden dato.',
  },
  months: [
    'Januar',
    'Februar',
    'Marts',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  weekdays: [
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
    'Søndag',
  ],
};
