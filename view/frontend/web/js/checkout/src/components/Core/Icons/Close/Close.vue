<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    width="25"
    height="25"
  >
    <path d="M16.7334 8.66211C16.7334 8.55469 16.6455 8.4668 16.5381 8.4668L14.9268 8.47412L12.5 11.3672L10.0757 8.47656L8.46191 8.46924C8.35449 8.46924 8.2666 8.55469 8.2666 8.66455C8.2666 8.71094 8.28369 8.75488 8.31299 8.7915L11.4893 12.5757L8.31299 16.3574C8.28349 16.3932 8.26712 16.438 8.2666 16.4844C8.2666 16.5918 8.35449 16.6797 8.46191 16.6797L10.0757 16.6724L12.5 13.7793L14.9243 16.6699L16.5356 16.6772C16.6431 16.6772 16.731 16.5918 16.731 16.4819C16.731 16.4355 16.7139 16.3916 16.6846 16.355L13.5132 12.5732L16.6895 8.78906C16.7187 8.75488 16.7334 8.7085 16.7334 8.66211Z" />
    <path d="M12.5 1.58691C6.45996 1.58691 1.5625 6.48438 1.5625 12.5244C1.5625 18.5645 6.45996 23.4619 12.5 23.4619C18.54 23.4619 23.4375 18.5645 23.4375 12.5244C23.4375 6.48438 18.54 1.58691 12.5 1.58691ZM12.5 21.6064C7.48535 21.6064 3.41797 17.5391 3.41797 12.5244C3.41797 7.50977 7.48535 3.44238 12.5 3.44238C17.5146 3.44238 21.582 7.50977 21.582 12.5244C21.582 17.5391 17.5146 21.6064 12.5 21.6064Z" />
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Close',
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
