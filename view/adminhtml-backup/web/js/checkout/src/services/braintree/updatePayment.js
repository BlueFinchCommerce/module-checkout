export default (response, publicHash) => {
  const url = `/braintree/payment/updatepaymentmethod?${new URLSearchParams({
    nonce: response.nonce,
    public_hash: publicHash,
  })}`;
  return fetch(url)
    .then((res) => res.json());
};
