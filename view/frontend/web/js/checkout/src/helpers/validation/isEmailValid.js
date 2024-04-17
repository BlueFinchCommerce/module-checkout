export default (emailAddress) => {
  // Return early if the length is less than 4.
  if (emailAddress.length < 4) {
    return false;
  }

  // eslint-disable-next-line max-len
  const re = /^(([^<>()[\]\\.,;:-\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(emailAddress).toLowerCase());
};
