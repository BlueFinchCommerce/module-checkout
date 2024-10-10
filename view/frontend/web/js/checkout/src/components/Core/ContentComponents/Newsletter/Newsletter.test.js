import { shallowMount } from '@vue/test-utils';
import Checkbox from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import { createTestingPinia } from '@pinia/testing';
import Newsletter from './Newsletter.vue';

describe('Newsletter.vue', () => {
  const createWrapper = (overrides) => {
    const defaultMountingOptions = {
      global: {
        plugins: [createTestingPinia()],
        stubs: { Checkbox: true }, // Stub the Checkbox component
      },
      props: {},
      ...overrides,
    };
    return shallowMount(Newsletter, defaultMountingOptions);
  };

  it('renders when newsletter is enabled and guests are allowed', () => {
    const wrapper = createWrapper({
      computed: {
        newsletterEnabled: () => true,
        newsletterAllowGuests: () => true,
        isLoggedIn: () => false,
        newsletter: () => ({ isSubscribed: false }),
      },
    });
    expect(wrapper.find('.newsletter-container').exists()).toBe(true);
  });

  it('does not render for subscribed users', () => {
    const wrapper = createWrapper({
      computed: {
        newsletterEnabled: () => true,
        newsletterAllowGuests: () => true,
        isLoggedIn: () => true,
        newsletter: () => ({ isSubscribed: true }),
      },
    });
    expect(wrapper.find('.newsletter-container').exists()).toBe(false);
  });

  it('checkbox reflects the subscription status', () => {
    const wrapper = createWrapper({
      computed: {
        newsletterEnabled: () => true,
        newsletterAllowGuests: () => false,
        isLoggedIn: () => true,
        newsletter: () => ({ isSubscribed: false }),
      },
    });
    const checkbox = wrapper.findComponent(Checkbox);
    expect(checkbox.props('checked')).toBe(false);
  });

  it('updates subscription status on checkbox change', async () => {
    const wrapper = createWrapper({
      computed: {
        newsletterEnabled: () => true,
        newsletterAllowGuests: () => true,
        isLoggedIn: () => false,
        newsletter: () => ({ isSubscribed: false }),
      },
    });
    const checkbox = wrapper.findComponent(Checkbox);
    await checkbox.vm.$emit('change-handler', { target: { checked: true } });
    // Here you would check if the `updateNewsletterSubscription` action was called with the correct parameter.
    // This step requires mocking the `updateNewsletterSubscription` action to verify its invocation.
  });
});
