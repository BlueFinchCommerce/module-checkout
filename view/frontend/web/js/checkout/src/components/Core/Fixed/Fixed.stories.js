import Button from '@/components/Core/ActionComponents/Button/Button.vue';
import Fixed from './Fixed.vue';

export default {
  title: 'Global/Components/Fixed',
  component: Fixed,
  subcomponents: { Button },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
    },
  },
};

const Template = (args) => ({
  components: { Fixed, Button },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px; position:relative; transform: 'scale(1)'">
      <Fixed v-bind="args"> <Button primary=true label="Choose your shipping method" /> </Fixed>
      <div style="position: relative">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Fusce facilisis ullamcorper urna, eu viverra eros cursus blandit. 
          Aliquam malesuada ullamcorper elit sit amet interdum. 
          Nulla faucibus nibh eu sapien consequat faucibus. 
          Maecenas risus velit, aliquet at dapibus eget, volutpat nec ante. 
          Quisque lacus erat, malesuada et viverra eu, accumsan eget lacus. 
          Aliquam sagittis rhoncus pharetra. Maecenas auctor a tortor a faucibus. 
          Nulla molestie eleifend nunc, at porttitor dui viverra rutrum. Etiam elit nulla, 
          tristique sed tempor at, dictum interdum mi. Praesent ac sem augue. 
          Nullam volutpat scelerisque arcu quis viverra.
        </p>
      </div>
    </div>
  `,
});

export const FixedComponent = Template.bind({});
