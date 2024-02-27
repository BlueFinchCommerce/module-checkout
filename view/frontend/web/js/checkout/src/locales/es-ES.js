/* eslint-disable max-len */
export default {
  header: {
    text: 'Pago seguro',
  },
  dividerText: 'O introduzca su dirección de correo electrónico para pagar con tarjeta de crédito/débito',
  payNoExpressWithBlockTitle: 'Introduzca su dirección de correo electrónico para pagar con tarjeta de crédito/débito',
  orderSummary: {
    applyBtn: 'Solicitar',
    removeBtn: 'Eliminar',
    modalHeader: 'Resumen del pedido',
    mobileDiscountText: '',
    backBtn: 'Volver',
    grandTotalTitle: 'Total compra',
    inclTaxTitle: 'IVA',
    exclTaxTitle: 'Sin IVA',
    discountTitle: 'Descuento',
    subtotalTitle: 'Total',
    removeItemButton: 'Eliminar',
    removeItemButtonLabel: 'Quitar artículo',
    minusOneItem: 'Un artículo menos',
    plusOneItem: 'Un artículo más',
    giftDiscountTitle: 'Introducir código promocional',
    giftCardDiscount: {
      placeholder: 'Introducir código',
      successMessage: 'Código introducido con éxito "{code}".',
    },
    couponCodeTitle: 'Pedido de más',
    couponCodeTitleBottom: 'por uno',
    couponCodeTitleFreeShipping: 'envío gratuito',
    couponCode: {
      placeholder: 'Introducir código',
    },
    addToCart: 'Añadir a la cesta',
    promoTitle: 'Completa tu pedido con...',
    closeButton: 'Cerrar resumen del pedido',
    mixedShipping: 'Enviado por separado',
    heliumItem: 'Se envía lleno',
    skuNumber: 'Nº SKU',
    supplierStockNumber: 'Proveedor Nº de stock:',
    storeCreditTitle: 'Store Credit',
  },
  progressBar: {
    detailStepTitle: 'Su información',
    shippingStepTitle: 'Envío',
    paymentStepTitle: 'Pago',
  },
  yourDetailsSection: {
    title: 'Sus datos',
    selectPlaceholder: 'Elija un país',
    showPassLabel: 'Mostrar u ocultar contraseña',
    phoneField: {
      infoMessage: 'Sólo utilizaremos este número para ponernos en contacto con usted en relación con su entrega.',
      placeholder: 'Introduzca el número de teléfono',
      label: 'Número de teléfono',
    },
    emailAddress: {
      placeholder: 'Introduzca la dirección de correo electrónico',
      label: 'Dirección de correo electrónico',
      span: 'Correo electrónico',
    },
    passwordField: {
      placeholder: 'Introduzca su contraseña',
      label: 'Su contraseña',
    },
    firstName: {
      placeholder: 'Introduzca su nombre',
      label: 'Nombre',
    },
    lastName: {
      placeholder: 'Introduzca sus apellidos',
      label: 'Apellidos',
    },
    deliverySection: {
      toShippingButton: 'Elija su método de envío',
      title: 'Dirección de envío',
      savedAddressesTitle: 'Seleccione su dirección de envío guardada',
      shipHere: 'Enviar aquí',
      info: '¿Dónde debemos entregarlo?',
      billingAddressTitle: 'Dirección de facturación',
      deliveryAddressTitle: 'Dirección de envío',
      addressFinder: {
        title: 'Buscador de direcciones',
        placeholder: 'Buscar por nombre de calle o código postal',
        label: 'Calle o código postal',
      },
      addressForm: {
        saveAddressButton: 'Utilice esta dirección',
        linkText: 'Introduzca su dirección manualmente',
        addressField: {
          placeholder: 'Introduzca la primera línea de la dirección',
          unrequired: 'Introduzca la dirección (línea 2)',
          label: 'Primera línea de la dirección',
          unrequiredLabel: 'Dirección (línea 2)',
        },
        cityField: {
          label: 'Ciudad',
          placeholder: 'Introduzca la ciudad',
        },
        countryField: {
          label: 'País',
          placeholder: 'Introduzca el país',
        },
        postCodeField: {
          label: 'Código postal',
          placeholder: 'Introduzca el código postal',
        },
        regionField: {
          label: 'Provincia',
          placeholder: 'Introduzca la provincia',
        },
      },
    },
    editButton: 'Modificar',
    editButtonLabel: 'Modificar dirección de correo electrónico',
    editDetailsButtonLabel: 'Modificar sus datos',
    editShippingButtonLabel: 'Modificar sus datos de envío',
  },
  errorMessages: {
    firstNameErrorMessage: 'Introduzca un nombre válido',
    lastNameErrorMessage: 'Introduzca un apellido válido',
    emailErrorMessage: 'Introduzca una dirección de correo electrónico válida',
    phoneErrorMessage: 'Número de teléfono no válido',
    passwordHelpText: 'Mínimo 8 caracteres y debe incluir al menos tres clases de caracteres',
    passwordErrorMessage: 'Introduzca una dirección de correo electrónico y una contraseña válidas.',
    addressFormErrorMessage: 'Asegúrese de rellenar todos los campos obligatorios',
    postCodeErrorMessage: 'Introduzca un código postal válido para',
    countryErrorMessage: 'Seleccione su país',
    streetErrorMessage: 'Introduzca una dirección válida con un máximo de 75 caracteres.',
    cityErrorMessage: 'Introduzca una ciudad válida',
    regionErrorMessage: 'Introduzca una país válido',
    googlePayShippingError: 'Falta el método de envío. Seleccione el método de envío e inténtelo de nuevo.',
    googlePayNominatedDayError: 'Lamentablemente, no podemos ofrecer el pago exprés en pedidos con entrega en día señalado.',
    oosErrorMessage: 'Lo sentimos, este artículo está agotado.',
    noShippingMethods: 'No se han encontrado métodos de envío para la dirección seleccionada.',
    googlePayNoShippingMethods: 'No se han encontrado métodos de envío para la dirección seleccionada.',
    unexpectedPaymentError: 'Ha ocurrido un error inesperado',
  },
  welcomeMessages: {
    accountBody: 'Acceda a su cuenta para pagar o continúe como invitado.',
    accountTitle: 'Bienvenido',
    getStarted: 'Introduce tu correo electrónico para empezar.',
    guestBody: '¡Parece que eres nuevo aquí! Continuar con el pago como invitado con la opción de crear una cuenta una vez que haya realizado su pedido',
    guestTitle: 'Hola',
  },
  signInButton: 'Conectarse',
  noAccountGuestButton: 'Continuar como invitado',
  accountGuestButton: 'O continuar como invitado',
  continueButton: 'Continuar',
  forgotPass: '¿Ha olvidado su contraseña?',
  updateButton: 'Actualizar',
  billingForm: {
    notSameAddress: 'Mi dirección de facturación y de envío coinciden',
  },
  shippingStep: {
    proceedToPay: 'Continuar con el pago',
    stepTitle: 'Seleccione la opción de envío',
    stepCompleteTitle: 'Envío',
    stepTitleSubText: 'Seleccione la opción de envío',
    nominatedDelivery: 'Seleccione la fecha deseada',
    tbc: 'Calculado en el siguiente paso',
    methodLabel: 'Recibido antes de',
    noDeliveryDate: 'Seleccione la fecha de entrega',
  },
  addNewAddressBtn: 'Añadir nueva dirección',
  saveNewAddress: 'Guardar en la libreta de direcciones',
  paymentStep: {
    title: 'Seleccione el método de pago',
    freePayment: 'No se requieren datos de pago',
    payNow: 'Pagar ahora',
    storedPayments: 'Sus pagos guardados',
    creditDebitCard: 'Tarjeta de crédito o débito',
  },
  productOptionsTrigger: 'Opciones de artículo',
  instantCheckout: 'Pago exprés',
  checkoutTitle: 'Pedido',
  adyen: {
    applePayTotal: 'Total compra',
    applePayNoShippingMethods: 'Actualmente no hay opciones de envío disponibles para usted. Por favor, inténtelo de nuevo o utilice otro método de pago',
    cardNumber: 'Número de tarjeta',
    expiry: 'Fecha de caducidad',
    storedPaymentLabel: '{name} Tarjeta guardada caduca el {lastFour}',
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
    localPayment: 'Local Payment',
    storePayment: 'Save for later use.',
  },
  agreements: {
    label: 'Acepto la',
    errorMessage: 'Este campo es obligatorio',
  },
  privacyPolicy: {
    content: 'Puede consultar cómo tratamos sus datos en nuestra',
    link: 'Política de privacidad',
  },
  termsServices: {
    content: 'Al realizar su pedido en nuestra web, acepta los ',
    generalLink: 'Términos y las Condiciones,',
    privacyLink: ' cumplimiento de la Política de Privacidad',
    withdrawLink: 'y la Política de Cambios y Devoluciones.',
  },
  newsletter: {
    label: 'Inscribirse en el boletín',
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
    donateText: 'Donar',
    removeDonation: 'Eliminar donación',
    donateTitle: 'Done sus céntimos',
    charityLogo: 'Logotipo benéfico',
    penniesLogo: 'Logotipo de Pennies',
  },
  payWith: {
    masterCard: 'pagar con Master Card',
    visa: 'pagar con Visa',
    paypal: 'pague con PayPal',
    clearPay: 'pague con Clearpay',
    klarna: 'pague con Klarna',
  },
  giftMessage: {
    to: 'Para:',
    from: 'De:',
    message: 'Mensaje:',
  },
  inflatableBalloons: {
    title: 'Entrega de globos',
    description: 'Su(s) globo(s) preinflado(s) será(n) entregado(s) en la fecha seleccionada a continuación, todos los demás artículos de su pedido serán entregados según el método de envío elegido.',
    openBtnText: 'Elija un día de entrega.',
    savedMethod: 'Entrega de globos inflados.',
    message: '* La fecha seleccionada ya no está disponible. Por favor, elija otra fecha.',
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    weekdays: [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ],
  },
};
