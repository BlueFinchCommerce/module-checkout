export default (error) => {
  // Try to get the error message from the response and throw again.
  let message = this.$t('errorMessages.unexpectedPaymentError');
  if (error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }
  throw new Error(message);
};
