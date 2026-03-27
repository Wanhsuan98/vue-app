module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-trailing-spaces': 'error', // 禁止行尾空白
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // 禁止重複空行，檔案結尾不留空行

    'vue/multi-word-component-names': 'off', // 允許單一單字的元件名
    '@typescript-eslint/no-explicit-any': 'warn', // 避免使用 any
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
