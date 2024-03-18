import { shallowMount } from '@vue/test-utils';
import ErrorMessage from './ErrorMessage.vue';

describe('ErrorMessage.vue', () => {
  it('ErrorMessage exist', () => {
    const wrapper = shallowMount(ErrorMessage);
    expect(wrapper.findComponent(ErrorMessage).exists()).toBe(true);
  });
});
