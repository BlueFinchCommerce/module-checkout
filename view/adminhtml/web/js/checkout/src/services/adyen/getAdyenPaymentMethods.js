import getDummyPaymentMethods from '@/helpers/dummyContent/getDummyPaymentMethods';

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
      transformGraphqlExtraDetails(getDummyPaymentMethods.adyenPaymentMethods.paymentMethodsExtraDetails),
  paymentMethodsResponse: getDummyPaymentMethods.adyenPaymentMethods.paymentMethodsResponse || {
    paymentMethods: [],
  },
});
