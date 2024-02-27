<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="modal-backdrop"
      ref="backdrop"
      @click="close"
      @keydown="focus"
      tabindex="0"
    />
  </transition>

  <transition name="slide" appear>
    <div
      v-show="visible"
      :class="getModalClasses"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
      @keydown="handleKeydown"
      @click.stop=""
    >
      <header
        v-if="header"
        id="modalTitle"
        class="modal-header"
      >
        <slot name="header" />
      </header>

      <section
        id="modalDescription"
        class="modal-body"
      >
        <slot name="body">
          This is the default body!
        </slot>
      </section>

      <footer
        v-if="footer"
        class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </transition>
</template>
<script>

export default {
  name: 'Modal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: '',
    },
    header: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    getModalClasses() {
      return `${this.classes} modal`;
    },
  },
  methods: {
    handleKeydown() {
      this.$emit('focus');
    },
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
