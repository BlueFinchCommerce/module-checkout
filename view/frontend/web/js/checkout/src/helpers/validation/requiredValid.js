export default (string, required) => {
  if (required) {
    if (!string || string.trim() === '') {
      return false;
    }
  }
  return true;
};
