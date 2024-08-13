import authenticatedRequest from '@/services/authenticatedRequest';
import createPayment from '@/services/payments/createPaymentGraphQl';
import createPaymentRest from '@/services/payments/createPaymentRest';
import getStoreConfig from '@/services/getStoreConfig';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

export default {
  authenticatedRequest,
  createPayment,
  createPaymentRest,
  getStoreConfig,
  refreshCustomerData,
};
