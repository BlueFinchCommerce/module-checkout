export default (string, required) => {
  if (required === '1') {
    if (!string || string.trim() === '') {
      return false;
    }
  }
  return true;
};
