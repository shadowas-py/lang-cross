module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: ['error', 2],
    'linebreak-style': 0,
    'no-underscore-dangle': 'off',
    'trailling-comma': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          ':': 'after',
        },
      },
    ],
  },
};
