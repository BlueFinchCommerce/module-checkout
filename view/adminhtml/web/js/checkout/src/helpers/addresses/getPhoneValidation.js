export default (phone) => {
  const phoneValid = /^[+]?[\d() -]{8,32}$/im.test(phone);
  return phoneValid;
};
