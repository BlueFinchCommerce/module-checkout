import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';
import formatAddress from '@/helpers/formatAddress';
import getShippingExtensionAttributes from '@/helpers/getShippingExtensionAttributes';
import doAddressesMatch from '@/helpers/doAddressesMatch';

export default ({
  shippingAddress,
  billingAddress,
  carrierCode,
  methodCode,
}) => {
  const extensionAttributes = getShippingExtensionAttributes();
  const formattedBillingAddress = formatAddress(billingAddress);
  // We need to remove the same_as_shipping information.
  delete formattedBillingAddress.same_as_shipping;

  // If shipping and billing match then there's no need to save billing to address book as well.
  if (doAddressesMatch(shippingAddress, billingAddress)) {
    delete formattedBillingAddress.save_in_address_book;
  }

  return authenticatedRequest().post(buildCartUrl('shipping-information'), {
    addressInformation: {
      shipping_address: formatAddress(shippingAddress),
      billing_address: formattedBillingAddress,
      extension_attributes: extensionAttributes,
      shipping_carrier_code: carrierCode,
      shipping_method_code: methodCode,
    },
  }).then((response) => response.data);
};
