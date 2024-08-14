import authenticatedRequest from '@/services/authenticatedRequest';
import createPayment from '@/services/payments/createPaymentGraphQl';
import createPaymentGraphQl from '@/services/payments/createPaymentGraphQl';
import createPaymentRest from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import getStoreConfig from '@/services/getStoreConfig';
import graphQlRequest from '@/services/graphQlRequest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default {
  authenticatedRequest,
  createPayment,
  createPaymentGraphQl,
  createPaymentRest,
  getShippingMethods,
  getStoreConfig,
  graphQlRequest,
  refreshCustomerData,
  setAddressesOnCart,
};
