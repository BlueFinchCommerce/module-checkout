export default (location) => {
  const fullAddress = [
    location.address,
    location.city,
    location.county,
    location.postcode,
  ];

  const removedEmpty = fullAddress.filter((addressLine) => addressLine);

  return removedEmpty.join(', ');
};
