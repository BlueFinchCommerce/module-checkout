export default (string, maxLength) => {
  if (!string) {
    return true;
  }

  return string.trim().length <= maxLength;
};
