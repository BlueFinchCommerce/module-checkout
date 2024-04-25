export default (emailAddress) => {
  // Return early if the length is less than 4.
  if (emailAddress.length < 4) {
    return false;
  }

  // eslint-disable-next-line max-len
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return re.test(String(emailAddress).toLowerCase());
};
