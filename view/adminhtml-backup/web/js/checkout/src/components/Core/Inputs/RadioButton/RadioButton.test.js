import { mount, shallowMount } from '@vue/test-utils';
import RadioButton from './RadioButton.vue';

describe('RadioButton.vue', () => {
  it('renders props.text when passed', () => {
    const text = 'new text';
    const wrapper = shallowMount(RadioButton, {
      props: { text },
    });
    expect(wrapper.text()).toMatch(text);
  });
});

test('RadioButton checked', async () => {
  const wrapper = mount(RadioButton);
  const checkboxInput = wrapper.find('input[type="radio"]');

  await checkboxInput.setChecked();

  expect(checkboxInput.element.checked).toBeTruthy();
});
