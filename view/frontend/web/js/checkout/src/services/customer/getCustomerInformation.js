import useCustomerStore from '@/stores/CustomerStore';
import tokenTypes from '@/helpers/tokens/getTokenTypes';
import graphQlRequest from '@/services/graphQlRequest';
import getMagentoSolutionType from '@/helpers/getMagentoSolutionType';

export default async () => {
  // Initialize the rewards and store credit query part based on Magento edition
  let rewardPointsQuery = '';
  let storeCreditPointsQuery = '';

  if (getMagentoSolutionType()) {
    rewardPointsQuery = `
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
    `;

    storeCreditPointsQuery = `
     store_credit {
        enabled
        current_balance {
          value
          currency
        }
      }
    `;
  }

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
      ${rewardPointsQuery}
      ${storeCreditPointsQuery}
      created_at
      is_subscribed
    }
  }`;

  try {
    const response = await graphQlRequest(request, {}, {}, 'BlueFinchCheckoutCustomer');
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
