import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.jsx', 'src/**/*.js'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['e2e/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // scripts 同時用到 Node（console、fs）與瀏覽器（page.evaluate 裡的 document）
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  prettier, // 必須放最後：關掉與 Prettier 衝突的格式規則
];
