import { shallowMount } from '@vue/test-utils';
import DropDown from './DropDown.vue';

describe('DropDown.vue', () => {
  it('DropDown exist', () => {
    const wrapper = shallowMount(DropDown);
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(DropDown).exists()).toBe(true);
  });
});
