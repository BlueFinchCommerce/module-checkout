import createPaymentRest from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import getStoreConfig from '@/services/getStoreConfig';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import authenticatedRequest from '@/services/authenticatedRequest';

export default {
  createPaymentRest,
  getShippingMethods,
  getStoreConfig,
  refreshCustomerData,
  authenticatedRequest,
};
