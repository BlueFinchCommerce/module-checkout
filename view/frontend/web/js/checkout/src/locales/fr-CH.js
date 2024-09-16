/* eslint-disable max-len */
export default {
  header: {
    text: 'Paiement sécurisé',
  },
  dividerText: 'Ou saisissez votre adresse e-mail pour payer par carte de crédit/débit',
  signInDividerText: 'or',
  payNoExpressWithBlockTitle: 'Saisissez votre adresse e-mail pour payer par carte de crédit/débit',
  orderSummary: {
    applyBtn: 'Appliquer',
    removeBtn: 'Supprimer',
    modalHeader: 'Récapitulatif de votre commande',
    mobileDiscountText: '',
    backBtn: 'Retour',
    grandTotalTitle: 'Montant total',
    inclTaxTitle: 'TVA',
    exclTaxTitle: 'Hors taxe',
    discountTitle: 'Remise',
    subtotalTitle: 'Sous-total',
    removeItemButton: 'Supprimer',
    removeItemButtonLabel: 'Supprimer l\'article',
    minusOneItem: 'Un article en moins',
    plusOneItem: 'Un article en plus',
    couponDiscountTitle: 'Add promo code',
    couponDiscount: {
      title: 'Coupon',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Enter promo code',
      successMessage: 'Successfully applied code "{code}".',
    },
    giftDiscountTitle: 'Ajouter un code promotionnel',
    giftCardDiscount: {
      title: 'Gift card "{code}"',
      errorMessage: 'Please enter a valid code.',
      placeholder: 'Saisir le code ici',
      successMessage: 'Le code "{code}" a bien été pris en compte',
    },
    couponCodeTitle: 'Encore...',
    couponCodeTitleBottom: 'pour bénéficier',
    couponCodeTitleFreeShipping: 'de la livraison gratuite',
    couponCode: {
      placeholder: 'Saisir le code ici',
    },
    addToCart: 'Ajouter au panier',
    promoTitle: 'Finalisez votre commande avec...',
    closeButton: 'Fermer le récapitulatif de commande',
    mixedShipping: 'Ce produit sera expédié séparément',
    heliumItem: 'Livré gonflé',
    skuNumber: 'N° SKU',
    supplierStockNumber: 'N° de stock fournisseur',
    storeCreditTitle: 'Store Credit',
    giftWrappingTitle: 'Gift Wrapping',
  },
  progressBar: {
    detailStepTitle: 'Vos coordonnées',
    shippingStepTitle: 'Expédition',
    paymentStepTitle: 'Paiement',
  },
  yourDetailsSection: {
    title: 'Vos coordonnées',
    selectPlaceholder: 'Veuillez sélectionner votre pays',
    showPassLabel: 'Afficher ou masquer le mot de passe',
    phoneField: {
      infoMessage: 'Nous n\'utiliserons ce numéro que si nous devons vous contacter au sujet de votre livraison.',
      placeholder: 'Saisissez votre numéro de téléphone',
      label: 'Numéro de téléphone',
      info: 'We will use this for delivery questions',
    },
    emailAddress: {
      placeholder: 'Saisissez votre adresse e-mail',
      label: 'Adresse e-mail',
      span: 'E-mail',
    },
    passwordField: {
      placeholder: 'Saisissez votre mot de passe',
      label: 'Votre mot de passe',
    },
    firstName: {
      placeholder: 'Saisissez votre prénom',
      label: 'Prénom',
    },
    lastName: {
      placeholder: 'Saisissez votre nom',
      label: 'Nom',
    },
    deliverySection: {
      toShippingButton: 'Choisissez votre mode d\'expédition',
      title: 'Adresse de livraison',
      savedAddressesTitle: 'Sélectionnez une adresse de livraison déjà enregistrée.',
      shipHere: 'Expédier ici',
      info: 'Où devons-nous le livrer ?',
      billingAddressTitle: 'Adresse de facturation',
      selectedBillingAddressTitle: 'Billing address',
      yourBillingAddress: 'Your billing address',
      newAddressTitle: 'Add new address',
      deliveryAddressTitle: 'Adresse de livraison',
      addressFinder: {
        title: 'Recherche d\'adresse',
        placeholder: 'Recherche par nom de rue ou code postal',
        label: 'Nom de la rue ou code postal',
      },
      addressForm: {
        saveAddressButton: 'Utiliser cette adresse',
        linkText: 'Saisissez votre adresse manuellement',
        addressField: {
          placeholder: 'Saisir la première ligne de l\'adresse',
          unrequired: 'Saisir l\'adresse (ligne 2)',
          label: 'Première ligne de l\'adresse',
          unrequiredLabel: 'Adresse (ligne 2)',
        },
        cityField: {
          label: 'Ville',
          placeholder: 'Saisir la ville',
        },
        countryField: {
          label: 'Pays',
          placeholder: 'Saisir le pays',
        },
        postCodeField: {
          label: 'Code postal',
          placeholder: 'Saisir le code postal',
        },
        regionField: {
          label: 'Département',
          placeholder: 'Saisir le département',
        },
      },
    },
    editButton: 'Modifier',
    editButtonLabel: 'Modifier votre adresse e-mail',
    editDetailsButtonLabel: 'Modifier vos coordonnées',
    editShippingButtonLabel: 'Modifier votre adresse d\'expédition',
  },
  errorMessages: {
    addressWrongError: 'Please check your address format.',
    sanitiseError: 'Caractère saisi non valide.',
    firstNameErrorMessage: 'Veuillez saisir un prénom valide',
    lastNameErrorMessage: 'Veuillez saisir un nom valide',
    emailErrorMessage: 'Veuillez saisir une adresse e-mail valide',
    phoneErrorMessage: 'Numéro de téléphone non valide',
    passwordHelpText: 'Doit contenir minimum 8 caractères et inclure au moins trois types de caractères',
    passwordErrorMessage: 'Veuillez saisir une adresse e-mail et un mot de passe valides.',
    addressFormErrorMessage: 'Veuillez vous assurer que tous les champs obligatoires sont bien remplis.',
    postCodeErrorMessage: 'Veuillez saisir un code postal valide pour',
    countryErrorMessage: 'Veuillez sélectionner votre pays',
    streetErrorMessage: 'Veuillez saisir une adresse valide et utiliser un maximum de 75 caractères.',
    cityErrorMessage: 'Veuillez saisir une ville valide',
    regionErrorMessage: 'Veuillez saisir un département valide',
    googlePayShippingError: 'Vous n\'avez pas sélectionné de mode d\'expédition. Veuillez sélectionner le mode d\'expédition désiré et réessayer.',
    googlePayNominatedDayError: 'Malheureusement, nous ne pouvons pas offrir le paiement express pour les commandes avec livraison le jour désigné.',
    oosErrorMessage: 'Désolé, cet article n\'est plus en stock.',
    noShippingMethods: 'Aucune mode d\'expédition n\'a été trouvé pour l\'adresse sélectionnée.',
    googlePayNoShippingMethods: 'Aucune mode d\'expédition n\'a été trouvé pour l\'adresse sélectionnée.',
    unexpectedPaymentError: 'Une erreur inattendue s\'est produite',
  },
  welcomeMessages: {
    accountBody: 'Connectez-vous à votre compte pour passer à la caisse ou continuez en tant qu\'invité.',
    accountTitle: 'Bienvenue à nouveau !',
    getStarted: 'Saisissez votre e-mail pour commencer.',
    guestBody: 'Il semble que vous soyez nouveau ici ! Poursuivez votre commande en tant qu\'invité avec l\'option de créer un compte une fois que vous aurez passé votre commande.',
    guestTitle: 'Bonjour',
  },
  signInButton: 'Se connecter',
  noAccountGuestButton: 'Continuer en tant qu\'invité',
  accountGuestButton: 'Ou continuer en tant qu\'invité',
  continueButton: 'Continuer',
  forgotPass: 'Vous avez oublié votre mot de passe ?',
  updateButton: 'Actualiser',
  billingForm: {
    notSameAddress: 'Mes adresses de facturation et de livraison sont les mêmes',
  },
  shippingStep: {
    proceedToPay: 'Passer au paiement',
    stepTitle: 'Sélectionner un mode d\'expédition',
    stepCompleteTitle: 'Expédition',
    stepTitleSubText: 'Sélectionnez un mode d\'expédition',
    nominatedDelivery: 'Choisissez le jour qui vous convient.',
    tbc: 'Calculé à l\'étape suivante',
    methodLabel: 'Recevoir avant le',
    noDeliveryDate: 'Choisir la date de livraison',
  },
  addNewAddressBtn: 'Ajouter une autre adresse',
  saveNewAddress: 'Enregistrer dans le carnet d\'adresses',
  paymentStep: {
    titleGuest: 'Sélectionnez un mode de paiement',
    titleStored: 'Your saved payment methods',
    titleNew: 'Select new payment method',
    freePayment: 'Aucune information de paiement n\'est requise',
    payNow: 'Payer maintenant',
    storedPayments: 'Vos paiements enregistrés',
    creditDebitCard: 'Carte de crédit ou de débit',
  },
  productOptionsTrigger: 'Options de produit',
  instantCheckout: 'Paiement instantané',
  checkoutTitle: 'Paiement',
  adyen: {
    applePayTotal: 'Montant total',
    applePayNoShippingMethods: 'Aucun mode d\'expédition n\'est actuellement disponible pour vous.  Veuillez réessayer ou utiliser un autre mode de paiement.',
  },
  paymentCard: {
    cardNumber: 'Numéro de carte',
    expiry: 'Date d\'expiration',
    select: 'Select',
    storedPaymentLabel: '{name} La carte enregistrée expire le {lastFour}',
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
    label: 'Je confirme que j\'ai lu et que j\'accepte les',
    errorMessage: 'Ce champ est obligatoire.',
  },
  privacyPolicy: {
    content: 'Vos données seront traitées comme indiqué dans notre',
    link: 'politique de confidentialité',
  },
  termsServices: {
    content: 'En cliquant sur "Commander", vous acceptez ',
    generalLink: 'notre CGV, ',
    privacyLink: ' notre clause de confidentialité',
    withdrawLink: 'nos directives de rétractation.',
  },
  newsletter: {
    label: 'S\'abonner à la lettre d\'information',
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
    donateText: 'Faire un don',
    removeDonation: 'Supprimer le don',
    donateTitle: 'Donnez vos centimes',
    charityLogo: 'Logo de l\'association caritative',
    penniesLogo: 'Logo de Pennies',
  },
  payWith: {
    masterCard: 'Payer avec une Master Card',
    visa: 'Payer avec une Visa',
    paypal: 'Payer avec PayPal',
    clearPay: 'Payer avec Clearpay',
    klarna: 'Payer avec Klarna',
  },
  giftMessage: {
    to: 'A ',
    from: 'De ',
    message: 'Message ',
  },
  inflatableBalloons: {
    title: 'Livraison des ballons',
    description: 'Votre (vos) ballon(s) pré-gonflé(s) sera (seront) livré(s) à la date sélectionnée ci-dessous. Les autres articles de votre commande seront livrés selon l\'option de livraison que vous aurez choisie.',
    openBtnText: 'Sélectionnez le jour qui vous convient.',
    savedMethod: 'Livraison de ballons gonflés.',
    message: '* Le jour que vous avez sélectionné n\'est plus disponible. Veuillez choisir une autre date.',
  },
  months: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  weekdays: [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ],
};
