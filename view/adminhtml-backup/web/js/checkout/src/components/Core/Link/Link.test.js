import { shallowMount } from '@vue/test-utils';
import Link from './Link.vue';

describe('Link.vue', () => {
  it('renders props.label when passed', () => {
    const label = 'new label';
    const wrapper = shallowMount(Link, {
      props: { label },
    });
    expect(wrapper.text()).toMatch(label);
  });
});
