<template>
  <div
    class="vaulted-method-loader"
    aria-hidden="true"
  >
    <div class="vaulted-method-loader__card text-loading" />
  </div>
</template>

<style lang="scss" scoped>
.vaulted-method-loader {
  margin-bottom: var(--indent__base);
  width: 100%;

  &__card {
    min-height: var(--vaulted-method-loader-min-height, 138px);
    border-radius: var(--selectable__border-radius, 8px);
    max-width: var(--vaulted-method-loader-max-width, 440px);
  }
}
</style>
