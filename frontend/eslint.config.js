import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // a11y gaps are tracked as a dedicated follow-up (see SETUP_NOTES);
      // surface them as warnings for now rather than failing the build.
      ...Object.fromEntries(
        Object.keys(jsxA11y.flatConfigs.recommended.rules).map((rule) => [
          rule,
          'warn',
        ]),
      ),
      'react/jsx-no-target-blank': 'off',
      // Runtime PropTypes validation is being retired in favour of
      // `checkJs` + typed JSDoc (modernization roadmap Phase 5). ~225 of the
      // components never declared propTypes; rather than backfill a pattern
      // we're removing, the rule is off until the type layer replaces it.
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, extraHOCs: ['connect'] },
      ],
    },
  },
  {
    // Node-context config files: give them Node globals so `process`,
    // `__dirname`, etc. don't trip `no-undef`.
    files: ['*.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Vitest test files run in a jsdom + Vitest-globals environment
    // (`globals: true` in vite.config.js).
    files: ['**/*.{test,spec}.{js,jsx}', 'src/utils/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },
  // Turn off stylistic rules that Prettier owns. Must be last.
  prettier,
]
