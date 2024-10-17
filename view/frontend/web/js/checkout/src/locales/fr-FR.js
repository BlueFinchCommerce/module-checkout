/* eslint-disable max-len */
export default {
  header: {
    text: 'Paiement sécurisé',
  },
  dividerText: 'ou',
  signInDividerText: 'or',
  payNoExpressWithBlockTitle: 'Enter your email address to pay by credit or debit card',
  payWithBlockTitle: 'Payer avec',
  orderSummary: {
    applyBtn: 'Utiliser',
    removeBtn: 'Supprimer',
    modalHeader: 'Récapitulatif de la commande',
    mobileDiscountText: 'Entrez votre code de réduction',
    backBtn: 'Retour',
    grandTotalTitle: 'Total à payer',
    inclTaxTitle: 'TTC',
    exclTaxTitle: 'HT',
    discountTitle: 'Remise',
    subtotalTitle: 'Sous-total',
    removeItemButton: 'Supprimer l\'article',
    removeItemButtonLabel: 'Supprimer l\'article',
    minusOneItem: 'Moins un article',
    plusOneItem: 'Plus un article',
    couponDiscountTitle: 'Add promo code',
    couponDiscount: {
      title: 'Coupon',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter promo code',
      successMessage: 'Successfully applied code "{code}".',
    },
    giftDiscountTitle: 'Entrez votre code to réduction',
    giftCardDiscount: {
      title: 'Gift card "{code}"',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Entrez le code',
      successMessage: 'Coupon appliqué "{code}".',
    },
    crossSellsTitle: 'You may also like these items...',
    freeShippingAvailable: 'Bonne nouvelle: votre commande sera livrée gratuitement',
    couponCodeTitle: 'Dépensez',
    couponCodeTitleBottom: 'plus pour profiter',
    couponCodeTitleFreeShipping: 'de la livraison gratuite',
    couponCode: {
      placeholder: 'Entrez le code',
    },
    addToCart: 'Ajouter au panier',
    promoTitle: 'Produits fréquemment achetés ensemble',
    rewardsTitle: 'Points de fidélité',
    storeCreditTitle: 'Store Credit',
    giftWrappingTitle: 'Gift Wrapping',
  },
  progressBar: {
    detailStepTitle: 'Vos coordonnées',
    shippingStepTitle: 'Livraison',
    paymentStepTitle: 'Paiement',
  },
  yourDetailsSection: {
    title: 'Vos coordonnées',
    selectPlaceholder: 'Pays',
    showPassLabel: 'Afficher ou masquer le mot de passe',
    phoneField: {
      infoMessage: 'Pour les questions de livraison',
      placeholder: 'Numéro de téléphone',
      label: 'Téléphone',
      info: 'We will use this for delivery questions',
    },
    emailAddress: {
      placeholder: 'Saisissez votre email',
      label: 'L\'adresse e-mail',
      span: 'Email',
    },
    passwordField: {
      placeholder: 'Passe',
      label: 'Votre mot de passe',
    },
    firstName: {
      placeholder: 'Prénom',
      label: 'Prénom',
    },
    lastName: {
      placeholder: 'Nom',
      label: 'Nom',
    },
    deliverySection: {
      toShippingButton: 'Options de livraison',
      clickandCollectToPaymentButton: 'Confirm Your Shipping Method',
      title: 'Ou devons-nous livrer votre commande?',
      savedAddressesTitle: 'Vos adresses enregistrées',
      shipHere: 'Livrer ici',
      deliveryAddressTitle: 'Adresse de livraison',
      billingAddressTitle: 'Adresse de facturation',
      selectedBillingAddressTitle: 'Billing address',
      yourBillingAddress: 'Your billing address',
      newAddressTitle: 'Add new address',
      addressFinder: {
        title: 'Recherche d\'adresse',
        placeholder: 'Cherchez par nom de rue ou code postal',
        label: 'Société',
      },
      addressForm: {
        saveAddressButton: 'Expédier ici',
        linkText: 'Entrez votre addresse manuellement',
        addressField: {
          placeholder: 'Adresse 1',
          unrequired: 'Adresse 2',
          label: 'Adresse 1',
          unrequiredLabel: 'Adresse 2',
        },
        cityField: {
          label: 'Ville',
          placeholder: 'Ville',
        },
        countryField: {
          label: 'Pays',
          placeholder: 'Pays',
        },
        postCodeField: {
          label: 'Code postal',
          placeholder: 'Code postal',
        },
        regionField: {
          label: 'État/Province',
          placeholder: 'État/Province',
        },
      },
    },
    editButton: 'Éditer',
    editDetailsButtonLabel: 'Modifier vos coordonnées',
    editShippingButtonLabel: 'Modifier votre adresse de livraison',
  },
  errorMessages: {
    addressWrongError: 'Please check your address format.',
    sanitiseError: 'Caractère saisi non valide.',
    firstNameErrorMessage: 'Veuillez entrer votre prénom',
    lastNameErrorMessage: 'Veuillez entrer votre nom',
    emailErrorMessage: 'Veuillez entrer votre e-mail',
    phoneErrorMessage: 'Numéro de téléphone non valide',
    passwordHelpText: 'Minimum 8 caractères et doit inclure au moins trois types de caractères'
        + '(lettre minuscule, lettre majuscule, chiffre ou caractères spéciaux)',
    passwordErrorMessage: 'Entrer un mot de passe valide',
    addressFormErrorMessage: 'Veuillez vous assurez que tous les champs obligatoires sont remplis',
    postCodeErrorMessage: 'Entrez votre code postal',
    countryErrorMessage: 'Selectionnez votre pays',
    streetErrorMessage: 'Veuillez ajouter votre adresse postale (Maximum 75 caractères)',
    streetCharacterLimit: 'Veuillez utiliser un maximum de 75 caractères pour votre adresse postale',
    cityErrorMessage: 'Veuillez entrer votre ville',
    regionErrorMessage: 'Please enter a valid état/Province',
    googlePayShippingError: 'Le mode de livraison est manquant. Veuillez sélectionner lle mode de livraison et réessayer.',
    googlePayNominatedDayError: 'Malheureusement, nous ne pouvons pas proposer le paiement express sur les commandes avec livraison le jour désigné.',
    noShippingMethods: "Aucun mode de livraison trouvé pour l'adresse sélectionnée.",
    googlePayNoShippingMethods: "Aucun mode de livraison trouvé pour l'adresse sélectionnée.",
    unexpectedPaymentError: 'Une erreur inattendue s\'est produite',
    applePayNoShippingMethods: "Aucun mode de livraison trouvé pour l'adresse sélectionnée.",
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
    accountBody: "Connectez-vous à votre compte pour payer ou continuer en tant qu'invité.",
    accountTitle: 'Content de vous revoir!',
    getStarted: 'Entrez votre e-mail pour commencer',
    guestBody: 'On dirait que vous êtes nouvelle / nouveau ici ! Passez à la caisse en tant qu\'invité',
    guestTitle: 'Bonjour',
  },
  signInButton: 'Se connecter',
  noAccountGuestButton: 'Continuer en tant qu\'invité',
  accountGuestButton: 'Ou continuer en tant qu\'invité',
  continueButton: 'Continuer',
  forgotPass: 'Mot de passe oublié',
  updateButton: 'Mettre à jour',
  billingForm: {
    notSameAddress: 'Mes adresses de livraison et de facturation sont identiques',
  },
  shippingStep: {
    proceedToPay: 'Procéder au paiement',
    stepTitle: 'Sélectionnez un mode de livraison',
    stepCompleteTitle: 'Livraison',
    nominatedDelivery: 'Choisissez un jour qui vous convient.',
    tbc: "Calculé à l'étape suivante",
  },
  addNewAddressBtn: '+ Ajouter une nouvelle adresse',
  saveNewAddress: 'Enregistrer dans le carnet d\'adresses',
  paymentStep: {
    titleGuest: 'Sélectionnez un mode de paiement',
    titleStored: 'Your saved payment methods',
    titleNew: 'Select new payment method',
    freePayment: 'Aucune information de paiement requise',
    payNow: 'Payez maintenant',
    storedPayments: 'Vos paiements enregistrés',
    creditDebitCard: 'Carte de crédit ou de débit',
  },
  productOptionsTrigger: 'Sélectionner le produit',
  instantCheckout: 'Passage en caisse rapide',
  adyen: {
    applePayTotal: 'Montant global',
    applePayNoShippingMethods: 'Il n\'y a pas de méthode de livraison disponible pour vous en ce moment. Veuillez réessayer ou utiliser un autre mode de paiement.',
    paymentSuccessful: 'Payment Successful',
  },
  paymentCard: {
    cardNumber: 'Numéro de carte',
    expiry: 'D\'expiration',
    select: 'Select',
    storedPaymentLabel: '{name} La carte enregistrée se termine par {lastFour}',
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
    label: 'Je confirme avoir lu et accepté les',
    errorMessage: 'C\'est un champ obligatoire.',
    paymentErrorMessage: "Les accords n'ont pas été acceptés. Veuillez vérifier les accords et réessayer.",
  },
  privacyPolicy: {
    content: 'Vos données seront traitées comme indiqué dans notre ',
    link: 'Politique de confidentialité',
  },
  termsServices: {
    content: 'En cliquant sur "Commander", vous acceptez ',
    generalLink: 'notre CGV, ',
    privacyLink: ' notre clause de confidentialité',
    withdrawLink: 'nos directives de rétractation.',
  },
  newsletter: {
    label: 'Abonnez-vous à notre newsletter',
  },
  rewards: {
    applied: 'Des points de récompense ont été appliqués.',
    applyButton: 'Appliquer des points',
    available: ' disponible ',
    removeButton: 'Supprimer des points',
    rewardPoints: '{points} Points de récompense',
    youHave: 'Vous avez ',
  },
  storeCredit: {
    applyStoreCredit: 'You have {value} in store credit available.',
    applyButton: 'Use store credit',
    removeStoreCredit: 'Store credit has been used.',
    removeButton: 'Remove store credit',
  },
  payWith: {
    masterCard: 'payer avec mastercard',
    visa: 'payer avec visa',
    americanExpress: 'payer avec american express',
    clearPay: 'payer avec un clearpay',
    klarna: 'payer avec klarna',
  },
  giftMessage: {
    to: 'À',
    from: 'De',
    message: 'Message',
  },
};
