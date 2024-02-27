<template>
  <svg :style="style"
       :role="role"
       :aria-label="ariaLabel"
       width="36"
       height="30"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       data-v-3203e236="">
    <path d="M0 0h35.455v30H0z"></path>
    <path
        d="M17.5 23.654a14.85 14.85 0 0 0 3.247-.348l-2.196-2.172c-.342.026-.688.047-1.052.047-6.688 0-9.28-4.754-9.907-6.181a10.674 10.674 0 0 1 1.885-2.84L7.73 10.432c-1.923 2.06-2.652 4.137-2.665 4.177a1.216 1.216 0 0 0 0 .783c.026.082 2.893 8.262 12.434 8.262Zm0-17.308c-2.297 0-4.183.49-5.755 1.213L7.133 3 5.366 4.748 27.866 27l1.767-1.748-4.149-4.103c3.268-2.412 4.434-5.705 4.451-5.757a1.215 1.215 0 0 0 0-.783c-.027-.082-2.895-8.263-12.436-8.263Zm6.214 13.052-2.85-2.818A3.559 3.559 0 0 0 21.25 15c0-2.029-1.698-3.709-3.75-3.709a3.64 3.64 0 0 0-1.596.382l-2.26-2.235c1.24-.42 2.545-.63 3.856-.62 6.689 0 9.28 4.755 9.908 6.182-.378.855-1.458 2.895-3.693 4.398Z"
        fill="#3C3C3C"></path>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'HideIcon',
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    fill: {
      type: String,
    },
    stroke: {
      type: String,
    },
    role: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
        fill: reactiveProps.fill,
        stroke: reactiveProps.stroke,
      })),
    };
  },
};
</script>
