import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

export default () => {
  const { newsletterEnabled, newsletterAllowGuests } = useConfigStore();
  const customerStore = useCustomerStore();

  // If the User is logged in then check they aren't already subscribed.
  // If they are not logged in the check that guests are allowed to subscribe.
  const newSignUp = customerStore.isLoggedIn
    ? !customerStore.newsletter.isSubscribed
    : newsletterAllowGuests;

  if (newsletterEnabled
    && newSignUp
    && customerStore.newsletter.subscribeToNewsletter) {
    return `
      subscribeEmailToNewsletter(email: "${customerStore.customer.email}") {
        status
      }`;
  }

  return '';
};
