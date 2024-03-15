import { shallowMount, mount } from '@vue/test-utils';
import TextInput from './TextInput.vue';

describe('TextInput.vue', () => {
  it('renders props.text when passed', () => {
    const label = 'new label';
    const wrapper = shallowMount(TextInput, {
      props: { label },
    });
    expect(wrapper.text()).toMatch(label);
  });
});

test('setProps ariaLabel', async () => {
  const wrapper = mount(TextInput);

  await wrapper.setProps({ ariaLabel: 'new ariaLabel' });

  expect(wrapper.vm.ariaLabel).toBe('new ariaLabel');
});
