import authenticatedRequest from '@/services/authenticatedRequest';
import createPaymentGraphQl from '@/services/payments/createPaymentGraphQl';
import createPaymentRest from '@/services/payments/createPaymentRest';
import getQuote from '@/services/getQuote';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import getStoreConfig from '@/services/getStoreConfig';
import graphQlRequest from '@/services/graphQlRequest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default {
  authenticatedRequest,
  createPaymentGraphQl,
  createPaymentRest,
  getQuote,
  getShippingMethods,
  getStoreConfig,
  graphQlRequest,
  refreshCustomerData,
  setAddressesOnCart,
};
