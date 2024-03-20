export default (sameAsShipping = false) => {
  const address = {
    id: null,
    street: ['', ''],
    city: '',
    region: '',
    country_id: '',
    postcode: '',
    company: '',
    telephone: '',
    firstname: '',
    lastname: '',
    editing: false,
  };

  if (sameAsShipping) {
    address.same_as_shipping = true;
  }

  return address;
};
