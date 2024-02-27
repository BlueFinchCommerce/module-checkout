import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ShippingPage from './ShippingPage.vue';

describe('ShippingPage.vue', () => {
  it('ShippingPage exist', () => {
    const wrapper = mount(ShippingPage, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(ShippingPage).exists()).toBe(true);
  });
});
