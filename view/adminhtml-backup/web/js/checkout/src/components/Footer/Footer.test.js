import { shallowMount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import Footer from './Footer.vue';

describe('Footer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Footer exist', () => {
    const wrapper = shallowMount(Footer);
    expect(wrapper.findComponent(Footer).exists()).toBe(true);
    expect(wrapper.element).toMatchSnapshot();
  });
});
