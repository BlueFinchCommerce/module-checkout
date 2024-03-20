import graphQlRequest from '@/services/graphQlRequest';
import useCustomerStore from '@/stores/CustomerStore';

export default () => {
  const { customer: { email } } = useCustomerStore();
  const request = `
    mutation {
      subscribeEmailToNewsletter(email: "${email}") {
        status
      }
    }`;
  return graphQlRequest(request);
};
