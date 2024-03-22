export default (sameAsShipping = false) => {
  const address = {
    id: null,
    street: ['', ''],
    city: '',
    region: {
      region: '',
      region_id: '',
      region_code: '',
    },
    country_code: '',
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
