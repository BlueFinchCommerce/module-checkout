export default (value, minLength = 3) => {
  if (!value) {
    return true;
  }

  const phoneNumber = String(value).trim();
  const allowedCharacters = /^[+]?[\d() -]+$/;

  if (!allowedCharacters.test(phoneNumber)) {
    return false;
  }

  const digits = phoneNumber.replace(/\D/g, '');

  return digits.length >= Number(minLength || 3) && digits.length <= 15;
};
