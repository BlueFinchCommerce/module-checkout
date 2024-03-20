import { shallowMount } from '@vue/test-utils';
import TextField from './TextField.vue';

describe('TextField.vue', () => {
  it('renders props.text when passed', () => {
    const text = 'new message';
    const wrapper = shallowMount(TextField, {
      props: { text },
    });
    expect(wrapper.text()).toMatch(text);
  });
});
