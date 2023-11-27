const IGNORE = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'jest', 'react', 'react-hooks'],
  rules: {
    semi: IGNORE,
    'react/jsx-filename-extension': [ERROR, { extensions: ['.ts', '.tsx', '.json', '.js', 'jsx'] }],
    'react-hooks/rules-of-hooks': ERROR,
    'max-len': [WARN, { code: 160 }],
    '@typescript-eslint/no-unused-vars': WARN,
    'react-hooks/exhaustive-deps': WARN,
    'react/display-name': IGNORE,
    '@typescript-eslint/no-explicit-any': IGNORE,
    '@typescript-eslint/no-var-requires': IGNORE,
    '@typescript-eslint/ban-ts-comment': IGNORE,
    'import/extensions': IGNORE,
    'import/prefer-default-export': IGNORE,
    '@next/next/no-img-element': IGNORE,
    '@typescript-eslint/no-non-null-assertion': IGNORE
  },
}
