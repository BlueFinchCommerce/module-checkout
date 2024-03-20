import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ShippingMethod from './ShippingMethod.vue';

describe('ShippingMethod.vue', () => {
  it('ShippingMethod exist', () => {
    const wrapper = mount(ShippingMethod, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(ShippingMethod).exists()).toBe(true);
  });
});
