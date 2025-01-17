import graphQlRequest from '@/services/graphQlRequest';

export default async () => {
  const request = `{
    customerPaymentTokens {
      items {
        public_hash
        payment_method_code
        type
        details
      }
    }
  }`;
  const methods = await graphQlRequest(request, {}, {}, 'BetterCheckoutCustomerPaymentTokens')
    .then((response) => response.data.customerPaymentTokens?.items || []);
  return methods
    // Remove methods that aren't Braintree cards.
    .filter(({ payment_method_code: code }) => code === 'braintree')
    .reduce((prev, curr) => {
      const updated = prev;
      updated[curr.public_hash] = {
        ...curr,
        publicHash: curr.public_hash,
        details: JSON.parse(curr.details),
        selected: false,
      };
      return updated;
    }, {});
};
