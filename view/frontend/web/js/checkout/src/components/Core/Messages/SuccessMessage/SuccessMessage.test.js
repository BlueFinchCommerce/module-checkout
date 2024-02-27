import { shallowMount } from '@vue/test-utils';
import SuccessMessage from './SuccessMessage.vue';

describe('SuccessMessage.vue', () => {
  it('SuccessMessage exist', () => {
    const wrapper = shallowMount(SuccessMessage);
    expect(wrapper.findComponent(SuccessMessage).exists()).toBe(true);
  });
});
