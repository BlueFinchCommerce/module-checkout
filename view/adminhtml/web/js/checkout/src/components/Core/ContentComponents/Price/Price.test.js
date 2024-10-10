import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Price from './Price.vue';

describe('Price.vue', () => {
  it('renders props.value when passed', () => {
    const value = '345';
    const wrapper = shallowMount(Price, {
      props: { value },
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.text()).toMatch(value);
  });
});
