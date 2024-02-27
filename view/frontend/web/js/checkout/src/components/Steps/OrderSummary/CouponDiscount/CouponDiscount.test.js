import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import GiftCardDiscount from './CouponDiscount.vue';

describe('GiftCardDiscount.vue', () => {
  it('GiftCardDiscount exist', () => {
    const wrapper = shallowMount(GiftCardDiscount, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.findComponent(GiftCardDiscount).exists()).toBe(true);
  });
});
