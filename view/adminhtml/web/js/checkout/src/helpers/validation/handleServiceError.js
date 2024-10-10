export default (error) => {
  // Try to get the error message from the response and throw again.
  let message = '';
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  } else {
    message = this.$t('errorMessages.unexpectedPaymentError');
  }
  throw new Error(message);
};
