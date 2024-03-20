import { shallowMount } from '@vue/test-utils';
import Fixed from './Fixed.vue';

describe('Fixed.vue', () => {
  it('Fixed exist', () => {
    const wrapper = shallowMount(Fixed);
    expect(wrapper.findComponent(Fixed).exists()).toBe(true);
  });
});
