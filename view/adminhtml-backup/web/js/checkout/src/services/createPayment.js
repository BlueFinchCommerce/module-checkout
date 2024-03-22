import useCustomerStore from '@/stores/CustomerStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';
import beforePaymentRequest from '@/services/beforePaymentRequest';
import deepClone from '@/helpers/deepClone';
import doAddressesMatch from '@/helpers/doAddressesMatch';

export default (payment) => {
  const { selected: { shipping: shippingAddress } } = useCustomerStore();

  const clonedPayment = deepClone(payment);
  // We need to remove the same_as_shipping information.
  delete clonedPayment.billingAddress.same_as_shipping;

  // If shipping and billing match then there's no need to save billing to address book as well.
  if (doAddressesMatch(clonedPayment.billingAddress, shippingAddress)) {
    delete clonedPayment.billingAddress.save_in_address_book;
  }

  return beforePaymentRequest()
    .then(() => authenticatedRequest().post(buildCartUrl('payment-information'), clonedPayment))
    .then((response) => response.data);
};
