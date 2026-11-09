import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const sourceFiles = ['*.js', 'src/**/*.{js,jsx}'];
const nodeFiles = ['src/config/**/*.js'];
const pureFiles = ['src/app/routes.js', 'src/app/logic/**/*.js'];

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
    files: ['src/app/**/*.{js,jsx}', 'src/pages/**/*.{js,jsx}', 'src/theme/**/*.{js,jsx}'],
    ignores: ['src/**/*.test.js', ...nodeFiles, ...pureFiles],
    languageOptions: {globals: globals.browser},
  },
  {
    files: ['*.js', ...nodeFiles, 'src/**/*.test.js'],
    // Node ESM globals exclude CommonJS-only require, exports and __dirname.
    languageOptions: {globals: globals.nodeBuiltin},
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: [...nodeFiles, 'src/**/*.test.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '(^|/)(config|plugins)(/|$)',
              message:
                'Node build configuration and plugins must not enter browser or shared modules.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/DevTools.jsx'],
    // Docusaurus replaces this development-only guard during bundling.
    languageOptions: {globals: {process: 'readonly'}},
  },
  {
    files: ['src/app/**/*.{js,jsx}', 'src/pages/**/*.{js,jsx}', 'src/theme/**/*.{js,jsx}'],
    ignores: ['src/**/*.test.js', ...nodeFiles, ...pureFiles],
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
