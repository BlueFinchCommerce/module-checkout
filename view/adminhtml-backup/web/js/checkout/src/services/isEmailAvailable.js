import graphQlRequest from './graphQlRequest';

export default async (email) => {
  const request = ` {
  isEmailAvailable(email: "${email}") {
    is_email_available
  }
} `;

  return graphQlRequest(request)
    .then((response) => response.data.isEmailAvailable.is_email_available);
};
