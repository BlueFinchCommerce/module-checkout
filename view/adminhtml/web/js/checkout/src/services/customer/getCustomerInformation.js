import useCustomerStore from '@/stores/CustomerStore';
import tokenTypes from '@/helpers/tokens/getTokenTypes';
import graphQlRequest from '@/services/graphQlRequest';

export default async () => {
  const request = `{
    customer {
      default_billing
      default_shipping
      email
      firstname
      lastname
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
          region_code
          region_id
        }
        region_id
        street
        telephone
      }
      created_at
      reward_points {
        balance {
          points
          money {
            value
          }
        }
        subscription_status {
          balance_updates
        }
      }
      store_credit {
        enabled
        current_balance {
          value
          currency
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
