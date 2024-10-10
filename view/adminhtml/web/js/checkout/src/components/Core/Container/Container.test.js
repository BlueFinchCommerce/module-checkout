import { shallowMount } from '@vue/test-utils';
import Container from './Container.vue';

describe('Container.vue', () => {
  it('Container exist', () => {
    const wrapper = shallowMount(Container);
    expect(wrapper.findComponent(Container).exists()).toBe(true);
  });
});
