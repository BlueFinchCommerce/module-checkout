import { shallowMount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import PaymentPage from './PaymentPage.vue';

describe('PaymentPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('PaymentPage exist', () => {
    const wrapper = shallowMount(PaymentPage);
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(PaymentPage).exists()).toBe(true);
  });
});
