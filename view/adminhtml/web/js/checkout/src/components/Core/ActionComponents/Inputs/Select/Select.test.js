import { mount } from '@vue/test-utils';
import Select from './Select.vue';

test('setSelected demo', async () => {
  const wrapper = mount(Select);
  expect(wrapper.findComponent(Select).exists()).toBe(true);
});
