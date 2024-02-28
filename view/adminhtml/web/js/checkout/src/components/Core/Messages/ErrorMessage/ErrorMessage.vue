<template>
  <div class="error-message" :style="style">
    <ErrorIcon/>
    <TextField :text="message" />
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import TextField from '../../TextField/TextField.vue';
import ErrorIcon from '../../Icons/ErrorIcon/ErrorIcon.vue';

export default {
  name: 'ErrorMessage',
  components: {
    TextField,
    ErrorIcon,
  },
  props: {
    message: {
      type: String,
      require: true,
      default: '',
    },
    backgroundColor: {
      type: String,
    },
    color: {
      type: String,
    },
    borderColor: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
        color: reactiveProps.color,
        borderColor: reactiveProps.borderColor,
      })),
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/core/form";
</style>
