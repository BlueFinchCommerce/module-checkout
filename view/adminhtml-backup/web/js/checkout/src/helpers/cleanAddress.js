export default (address, removeSave = false) => {
  if (!address) return false;
  const cleanedAddress = address;
  // Array of address fields we don't want when saving the address
  const keysToRemove = [
    'customer_id',
    'default_shipping',
    'default_billing',
    'editing',
  ];

  keysToRemove.forEach((element) => {
    delete cleanedAddress[element];
  });

  if (cleanedAddress.region && cleanedAddress.region.region) {
    cleanedAddress.region = cleanedAddress.region.region;
  }

  if (removeSave) {
    delete cleanedAddress.save_in_address_book;
  }

  return cleanedAddress;
};
