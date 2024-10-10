export default (sameAsShipping = false) => {
  const address = {
    id: 1,
    street: ['20 Middle St', ''],
    city: 'Brighton and Hove',
    region: '',
    country: {
      code: 'GB',
      label: 'GB',
    },
    postcode: 'BN1 1AL',
    company: '',
    telephone: '01273 030390',
    firstname: 'Gene',
    lastname: 'Commerce',
    editing: false,
  };

  if (sameAsShipping) {
    address.same_as_shipping = true;
  }

  return address;
};
