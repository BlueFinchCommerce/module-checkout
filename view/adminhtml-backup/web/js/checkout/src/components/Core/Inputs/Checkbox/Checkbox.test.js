import { mount, shallowMount } from '@vue/test-utils';
import Checkbox from './Checkbox.vue';

describe('Checkbox.vue', () => {
  it('renders props.text when passed', () => {
    const text = 'new text';
    const wrapper = shallowMount(Checkbox, {
      props: { text },
    });
    expect(wrapper.text()).toMatch(text);
  });
});

test('Checkbox checked', async () => {
  const wrapper = mount(Checkbox);
  const checkboxInput = wrapper.find('input[type="checkbox"]');

  await checkboxInput.setChecked();

  expect(checkboxInput.element.checked).toBeTruthy();
});
