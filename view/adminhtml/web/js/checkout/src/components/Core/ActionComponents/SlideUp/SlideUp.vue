<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="slideup-backdrop"
      @click="close"
      @keydown="focus"
    />
  </transition>

  <transition name="slideup" appear>
    <div
      v-show="visible"
      class="slideup-container"
      role="dialog"
      aria-labelledby="slideUpTitle"
      aria-describedby="slideUpBody"
      @click.stop=""
    >
      <header
        id="slideUpTitle"
        class="slideup-header"
      >
        <slot name="header" />
      </header>

      <section
        id="slideUpBody"
        class="slideUp-body"
      >
        <slot name="body" />
      </section>
    </div>
  </transition>
</template>
<script>

export default {
  name: 'SlideUp',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'focus'],
  methods: {
    close() {
      this.$emit('close');
    },
    focus() {
      this.$emit('focus');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
