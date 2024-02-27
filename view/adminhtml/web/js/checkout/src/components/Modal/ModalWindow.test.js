import { shallowMount } from '@vue/test-utils';
import Modal from './Modal.vue';

describe('Modal.vue', () => {
  it('Modal exist', () => {
    const wrapper = shallowMount(Modal);
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(Modal).exists()).toBe(true);
  });
});
