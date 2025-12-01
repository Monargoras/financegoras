import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import jestPlugin from 'eslint-plugin-jest'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

const config = [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/semi': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}'],
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
    },
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', '.yarn/**', '**.d.ts', '**.cjs', '**.mjs', '.storybook/**'],
  },
]

export default config