import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ProgressBar from './ProgressBar.vue';
import router from '../../../router';

const mountOptions = {
  global: {
    mocks: {
      $route: 'checkout',
      $router: {
        push: jest.fn(),
      },
    },
    plugins: [router, createTestingPinia()],
  },
};

describe('ProgressBar.vue', () => {
  it('ProgressBar exist', () => {
    const wrapper = shallowMount(ProgressBar, mountOptions);
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(true);
    expect(wrapper.get('.progress-bar-container')
      .getComponent({ name: 'router-link' }))
      .toBeTruthy();
  });
});
