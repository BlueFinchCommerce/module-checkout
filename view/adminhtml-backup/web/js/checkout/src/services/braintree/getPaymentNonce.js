export default (publicHash) => {
  const url = `/braintree/payment/getnonce?${new URLSearchParams({
    cvv: '',
    public_hash: publicHash,
  })}`;
  return fetch(url)
    .then((res) => res.json())
    .then(({
      paymentMethodNonce: nonce,
      details: { bin },
      message,
    }) => {
      if (!nonce) {
        throw new Error(message);
      }

      return { nonce, bin };
    });
};
