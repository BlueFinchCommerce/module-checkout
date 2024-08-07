export default (string, minLength) => {
  if (!string) {
    return true;
  }

  return string.trim().length >= minLength;
};
