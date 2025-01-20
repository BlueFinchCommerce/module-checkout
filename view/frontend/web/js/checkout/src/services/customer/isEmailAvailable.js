import graphQlRequest from '@/services/graphQlRequest';

export default async (email) => {
  const request = ` {
  isEmailAvailable(email: "${email}") {
    is_email_available
  }
} `;

  return graphQlRequest(request, {}, {}, 'BetterCheckoutEmailAvailable')
    .then((response) => (
      typeof response.data?.isEmailAvailable?.is_email_available !== 'undefined'
        ? response.data.isEmailAvailable.is_email_available
        : true
    ));
};
