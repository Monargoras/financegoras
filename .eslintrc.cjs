module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended', 'plugin:jest/recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['testing-library', 'jest', '@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'linebreak-style': 'off',
    '@typescript-eslint/semi': 'off',
    'max-len': ['error', { 'code': 150 }]
  },
};
