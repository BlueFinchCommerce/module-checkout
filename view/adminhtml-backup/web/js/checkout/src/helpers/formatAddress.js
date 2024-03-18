export default (address) => {
  const formattedAddress = address;
  delete formattedAddress.id;
  delete formattedAddress.default_shipping;
  delete formattedAddress.default_billing;

  // Remove region if it's an object
  const { region } = formattedAddress;
  if (region && typeof region !== 'string') {
    delete formattedAddress.region;
  }

  return formattedAddress;
};
