import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Header from './Header.vue';

describe('Header.vue', () => {
  it('Header exist', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.findComponent(Header).exists()).toBe(true);
  });
});
