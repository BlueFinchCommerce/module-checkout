/* eslint-disable max-len */
export default {
  header: {
    text: 'Pagamento sicuro',
  },
  dividerText: 'Oppure inserisci il tuo indirizzo e-mail per pagare con carta di credito/debito',
  signInDividerText: 'or',
  payNoExpressWithBlockTitle: 'Inserisci il tuo indirizzo e-mail per pagare con carta di credito/debito',
  orderSummary: {
    applyBtn: 'Utilizza',
    removeBtn: 'Rimuovi',
    modalHeader: 'Riepilogo ordine',
    mobileDiscountText: '',
    backBtn: 'Indietro',
    grandTotalTitle: 'Importo Totale',
    inclTaxTitle: 'IVA',
    exclTaxTitle: 'più IVA.',
    discountTitle: 'Sconto',
    subtotalTitle: 'Totale',
    removeItemButton: 'Elimina',
    removeItemButtonLabel: 'Elimina articolo',
    minusOneItem: 'Un articolo in meno',
    plusOneItem: 'Un articolo in più',
    crossSellsTitle: 'You may also like these items...',
    couponDiscountTitle: 'Add promo code',
    couponDiscount: {
      title: 'Coupon',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter promo code',
      successMessage: 'Successfully applied code "{code}".',
    },
    giftDiscountTitle: 'Inserisci il codice promozionale',
    giftCardDiscount: {
      title: 'Gift card {code}',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Inserisci il codice',
      successMessage: 'Il codice "{code}" è stato inserito correttamente',
    },
    couponCodeTitle: 'Continua a ordinare',
    couponCodeTitleBottom: 'è possibile ottenere',
    couponCodeTitleFreeShipping: 'consegna gratuita',
    couponCode: {
      placeholder: 'Inserisci il codice',
    },
    addToCart: 'Aggiungi al carrello',
    promoTitle: 'Completa il tuo ordine con...',
    closeButton: 'Riepilogo ordine',
    mixedShipping: 'Questo artivolo sarà spedito separatamente',
    heliumItem: 'Spedito gonfiato',
    skuNumber: 'N. SKU',
    supplierStockNumber: 'N° di magazzino',
    storeCreditTitle: 'Store Credit',
    giftWrappingTitle: 'Gift Wrapping',
  },
  progressBar: {
    detailStepTitle: 'I tuoi recapiti',
    shippingStepTitle: 'Spedizione',
    paymentStepTitle: 'Pagamento',
  },
  yourDetailsSection: {
    title: 'I tuoi recapiti',
    selectPlaceholder: 'Scegli un paese',
    showPassLabel: 'Mostra o nascondi la password',
    phoneField: {
      infoMessage: 'Utilizzeremo questo numero solo se avremo bisogno di contattarti per la consegna.',
      placeholder: 'Inserisci il numero di telefono',
      label: 'Numero di telefono',
    },
    emailAddress: {
      placeholder: "Inserisci l'indirizzo e-mail",
      label: 'Indirizzo e-mail',
      span: 'E-mail',
    },
    passwordField: {
      placeholder: 'Inserisci la tua password',
      label: 'La tua password',
    },
    firstName: {
      placeholder: 'Inserisci il tuo nome',
      label: 'Nome',
    },
    lastName: {
      placeholder: 'Inserisci il tuo cognome',
      label: 'Cognome',
    },
    deliverySection: {
      toShippingButton: 'Scegli il metodo di spedizione',
      title: 'Indirizzo di spedizione',
      savedAddressesTitle: 'Scegli un indirizzo di consegna già salvato',
      shipHere: 'Spedire qui',
      info: 'Dove dobbiamo consegnare?',
      billingAddressTitle: 'Indirizzo di fatturazione',
      selectedBillingAddressTitle: 'Billing address',
      newAddressTitle: 'Add new address',
      deliveryAddressTitle: 'Indirizzo di spedizione',
      addressFinder: {
        title: 'Cerca indirizzo',
        placeholder: 'Cerca per nome o codice postale',
        label: 'Strada o codice postale',
      },
      addressForm: {
        saveAddressButton: 'Utilizza questo indirizzo',
        linkText: "Inserisci manualmente l'indirizzo",
        addressField: {
          placeholder: "Inserisci la prima riga dell'indirizzo",
          unrequired: "Inserisci l'indirizzo (riga 2)",
          label: "Prima riga dell'indirizzo",
          unrequiredLabel: 'Indirizzo (riga 2)',
        },
        cityField: {
          label: 'Città',
          placeholder: 'Inserisci la città',
        },
        countryField: {
          label: 'Paese',
          placeholder: 'Inserisci il paese',
        },
        postCodeField: {
          label: 'Codice postale',
          placeholder: 'Inserisci il codice postale',
        },
        regionField: {
          label: 'Provincia',
          placeholder: 'Inserisci la provincia',
        },
      },
    },
    editButton: 'Modifica',
    editButtonLabel: "Modifica l'indirizzo e-mail",
    editDetailsButtonLabel: 'Modifica informazioni',
    editShippingButtonLabel: 'Modifica informazioni di spedizione',
  },
  errorMessages: {
    addressWrongError: 'Please check your address format.',
    sanitiseError: 'È stato immesso un carattere non valido.',
    firstNameErrorMessage: 'Inserisci un nome valido',
    lastNameErrorMessage: 'Inserisci un cognome valido',
    emailErrorMessage: 'Inserisci un indirizzo e-mail valido',
    phoneErrorMessage: 'Numero di telefono non valido',
    passwordHelpText: 'Minimo 8 caratteri e almeno tre tipi di carattere.',
    passwordErrorMessage: 'Inserisci un indirizzo e-mail e una password validi',
    addressFormErrorMessage: 'Assicurarti che tutti i campi obbligatori siano compilati',
    postCodeErrorMessage: 'Inserisci un CAP valido per',
    countryErrorMessage: 'Seleziona il paese',
    streetErrorMessage: 'Inserisci un indirizzo valido e utilizza massimo 75 caratteri',
    cityErrorMessage: 'Inserisci una città valida',
    regionErrorMessage: 'Inserisci un paese valido',
    googlePayShippingError: 'Nessun metodo di spedizione selezionato. Scegli un metodo di spedizione e riprova.',
    googlePayNominatedDayError: 'Purtroppo non è possibile scegliere la spedizione express con la data di consegna richiesta',
    oosErrorMessage: "Purtroppo l'articolo è esaurito",
    noShippingMethods: "Nessun metodo di spedizione trovato per l'indirizzo selezionato",
    googlePayNoShippingMethods: "Nessun metodo di spedizione trovato per l'indirizzo selezionato",
    unexpectedPaymentError: 'Si è verificato un errore',
  },
  welcomeMessages: {
    accountBody: 'Accedi con un account cliente o continua come ospite',
    accountTitle: 'Bentornato!',
    getStarted: "Inserisci l'e-mail per iniziare",
    guestBody: "Vai al checkout come ospite; avrai la possibilità di creare un account dopo aver effettuato l'ordine",
    guestTitle: 'Ciao',
  },
  signInButton: 'Registrati',
  noAccountGuestButton: 'Procedi come ospite',
  accountGuestButton: 'Oppure continua come ospite',
  continueButton: 'Avanti',
  forgotPass: 'Hai dimenticato la password?',
  updateButton: 'Aggiorna',
  billingForm: {
    notSameAddress: "L'indirizzo di fatturazione e l'indirizzo di spedizione sono uguali",
  },
  shippingStep: {
    proceedToPay: 'Vai al pagamento',
    stepTitle: 'Scegli il metodo di spedizione',
    stepCompleteTitle: 'Spedizione',
    stepTitleSubText: 'Scegli il metodo di spedizione',
    nominatedDelivery: 'Scegli il giorno che preferisci',
    tbc: 'Calcolato nel passaggio successivo',
    methodLabel: 'Ricevi entro',
    noDeliveryDate: 'Scegli la data di consegna',
  },
  addNewAddressBtn: 'Aggiungi un nuovo indirizzo',
  saveNewAddress: 'Salva in rubrica',
  paymentStep: {
    titleGuest: 'Scegli il metodo di pagamento',
    titleStored: 'Your saved payment methods',
    titleNew: 'Select new payment method',
    freePayment: 'Non sono richieste informazioni di pagamento',
    payNow: 'Paga ora',
    storedPayments: 'I pagamenti effettuati',
    creditDebitCard: 'Carta di credito o di debito',
  },
  productOptionsTrigger: 'Opzioni articolo',
  instantCheckout: 'Checkout immediato',
  checkoutTitle: 'Checkout',
  adyen: {
    applePayTotal: 'Importo totale',
    applePayNoShippingMethods: 'Al momento non ci sono metodi di spedizione disponibili. Riprova o utilizza un altro metodo di pagamento.',
  },
  paymentCard: {
    cardNumber: 'Numero di carta',
    expiry: 'Data di scadenza',
    select: 'Select',
    storedPaymentLabel: '{name} La carta scade il {lastFour}',
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
    label: 'Confermo di aver letto e accetto il/la',
    errorMessage: 'Questo campo è obbligatorio',
  },
  privacyPolicy: {
    content: 'I tuoi dati saranno trattati come descritto nella nostra',
    link: 'politica sulla privacy',
  },
  termsServices: {
    content: 'Completando l\'ordine accetti i termini e ',
    generalLink: 'le condizioni,',
    privacyLink: ' le norme sulla protezione dei dati',
    withdrawLink: 'e le istruzioni di revoca.',
  },
  newsletter: {
    label: 'Iscriviti alla newsletter',
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
    donateText: 'Dona',
    removeDonation: 'Rimuovi la donazione',
    donateTitle: 'Dona i centesimi',
    charityLogo: 'Logo di Beneficenza',
    penniesLogo: 'Logo di Pennies',
  },
  payWith: {
    masterCard: 'Paga con Master Card',
    visa: 'Paga con Visa',
    paypal: 'Paga con Paypal',
    clearPay: 'Paga con Clearpay',
    klarna: 'Paga con Klarna',
  },
  giftMessage: {
    to: 'A',
    from: 'Da',
    message: 'Messaggio',
  },
  inflatableBalloons: {
    title: 'Consegna palloncini',
    description: "I tuoi palloncini pre-gonfiati verranno consegnati nella data selezionata di seguito, il tuo ordine arriverà in base all'opzione di consegna scelta.",
    openBtnText: 'Seleziona il giorno che preferisci',
    savedMethod: 'Consegna palloncini gonfiati.',
    message: "* La data selezionata non è più disponibile. Si prega di scegliere un'altra data.",
    months: [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ],
    weekdays: [
      'Lunedi',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
      'Domenica',
    ],
  },
};
