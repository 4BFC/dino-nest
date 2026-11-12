import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const sourceFiles = ['*.js', 'src/**/*.{js,jsx}'];
// Every script in src runs in the browser: components, pages, and theme wrappers.
const browserFiles = ['src/**/*.{js,jsx}'];

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    'build/**',
    '.docusaurus*/**',
    '.cache-loader/**',
    'coverage/**',
    'documents/**',
    '.agents/**',
    '.claude/**',
    '.codex/**',
    'public/**',
  ]),
  {
    files: sourceFiles,
    extends: [js.configs.recommended],
    languageOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    linterOptions: {reportUnusedDisableDirectives: 'error'},
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
      // Destructuring with rest deliberately omits fields from the result.
      'no-unused-vars': ['error', {ignoreRestSiblings: true}],
    },
  },
  {
    files: browserFiles,
    ignores: ['src/**/*.test.js'],
    languageOptions: {globals: globals.browser},
  },
  {
    files: ['*.js', 'src/**/*.test.js'],
    // Node ESM globals exclude CommonJS-only require, exports and __dirname.
    languageOptions: {globals: globals.nodeBuiltin},
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/**/*.test.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '(^|/)(config|plugins)(/|$)',
              message:
                'Node build configuration and plugins, such as @dino-ovum/preset/config, must not enter browser modules.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/theme/Root.jsx'],
    // Docusaurus replaces this development-only guard during bundling.
    languageOptions: {globals: {process: 'readonly'}},
  },
  {
    files: browserFiles,
    ignores: ['src/**/*.test.js'],
    languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}},
    plugins: {'react-hooks': reactHooks},
    // Start with hook correctness; React Compiler rules are a separate adoption.
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  // Formatting belongs to Prettier, including when more lint presets are added.
  {files: sourceFiles, extends: [prettier]},
]);
