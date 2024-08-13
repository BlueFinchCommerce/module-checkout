import authenticatedRequest from '@/services/authenticatedRequest';
import createPaymentRest from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import getStoreConfig from '@/services/getStoreConfig';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

export default {
  authenticatedRequest,
  createPaymentRest,
  getShippingMethods,
  getStoreConfig,
  refreshCustomerData,
};
