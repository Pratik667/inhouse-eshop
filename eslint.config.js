const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      // Code quality
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      eqeqeq: ['error', 'always'], // enforce === instead of ==
      curly: 'error', // always use {} in if/else
      'no-var': 'error', // use let/const instead of var
      'prefer-const': 'error', // use const when variable not reassigned
      'prefer-arrow-callback': 'error', // use arrow functions in callbacks

      // Prettier integration
      'prettier/prettier': 'error',
    },
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
  },
];
