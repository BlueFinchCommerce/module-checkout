export default (address1, address2) => {
  // Go through the steps to determine if two addresses match.
  const properties = [
    'city',
    'country_code',
    'firstname',
    'lastname',
    'postcode',
    'telephone',
  ];

  // If one property doesn't match then the whole thing can't match.
  const same = properties.every((property) => (
    address1[property] === address2[property]
  ));

  if (!same) {
    return false;
  }

  // Street is a little harder as it's an array.
  const steetSame = address1.street.every((element, index) => (
    address1.street[index] === address2.street[index]
  ));

  return steetSame;
};
