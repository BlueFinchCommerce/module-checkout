module.exports = {
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
    'max-len': ['error', { code: 100, ignorePattern: 'd="([\\s\\S]*?)"' }],
    'vue/multi-word-component-names': [0],
  },
};
