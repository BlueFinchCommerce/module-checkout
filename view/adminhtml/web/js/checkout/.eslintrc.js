module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
  ],
  plugins: [
    'jest',
  ],
  rules: {
    'import/no-cycle': [0],
    'max-len': ['error', { code: 120, ignorePattern: 'd="([\\s\\S]*?)"' }],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'vue/multi-word-component-names': [0],
  },
};
