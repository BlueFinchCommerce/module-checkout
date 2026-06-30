export default (value, minLength = 3) => {
  if (!value) {
    return true;
  }

  const phoneNumber = String(value).trim().replace(' ', '');

  return !phoneNumber || phoneNumber.length >= Number(minLength || 3);
};
