import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    rules: {
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // 強制單引號
      quotes: ['error', 'single'],
      // 禁用多餘空行
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      // 禁止行尾空白
      'no-trailing-spaces': 'error',
      // 禁用 any
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
