import useCustomerStore from '@/stores/CustomerStore';
import tokenTypes from '@/helpers/getTokenTypes';
import graphQlRequest from './graphQlRequest';

export default async () => {
  const request = `{
    customer {
      default_billing
      default_shipping
      email
      firstname
      lastname
      id
      addresses {
        city
        country_code
        default_billing
        default_shipping
        firstname
        id
        lastname
        postcode
        region {
          region
          region_id
        }
        region_id
        street
        telephone
      }
      created_at
      reward_points {
        subscription_status {
          balance_updates
        }
      }
      is_subscribed
    }
  }`;

  try {
    const response = await graphQlRequest(request);
    return response.data.customer;
  } catch (error) {
    // If there is an error, assume the user is a guest.
    const customerStore = useCustomerStore();
    customerStore.setData({
      customer: {
        tokenType: tokenTypes.guestUser,
      },
    });
    throw error; // Re-throw the error after handling it
  }
};
