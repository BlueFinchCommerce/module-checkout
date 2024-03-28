import getDummyAdyenPaymentMethods from '@/helpers/dummyContent/getDummyAdyenPaymentMethods';

function transformGraphqlExtraDetails(paymentMethodsExtraDetails) {
  const transformedData = paymentMethodsExtraDetails?.map((item) => ({
    [item.type]: {
      icon: item.icon,
      isOpenInvoice: item.isOpenInvoice,
      configuration: item.configuration,
    },
  })) || [];

  return Object.assign({}, ...transformedData);
}

export default async () => Promise.resolve({
  paymentMethodsExtraDetails:
      transformGraphqlExtraDetails(getDummyAdyenPaymentMethods.adyenPaymentMethods.paymentMethodsExtraDetails),
  paymentMethodsResponse: getDummyAdyenPaymentMethods.adyenPaymentMethods.paymentMethodsResponse || {
    paymentMethods: [],
  },
});
