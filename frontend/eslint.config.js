import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "coverage", "dev-dist"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "19" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // a11y gaps are tracked as a dedicated follow-up (see SETUP_NOTES);
      // surface them as warnings for now rather than failing the build.
      ...Object.fromEntries(
        Object.keys(jsxA11y.flatConfigs.recommended.rules).map((rule) => [
          rule,
          "warn",
        ])
      ),
      // The `const { x, ...rest } = obj` idiom for omitting a key is used
      // deliberately in a few reducers.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
      "react/jsx-no-target-blank": "off",
      // `label-has-for` is deprecated by eslint-plugin-jsx-a11y itself
      // (superseded by `label-has-associated-control`, which stays on).
      "jsx-a11y/label-has-for": "off",
      // Runtime PropTypes validation has been replaced by TypeScript prop types.
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, extraHOCs: ["connect"] },
      ],
    },
  },
  {
    // Node-context config files.
    files: ["*.config.{js,ts}", "eslint.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Vitest test files run in a jsdom + Vitest-globals environment.
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "src/utils/test/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
      },
    },
  },
  // Turn off stylistic rules that Prettier owns. Must be last.
  prettier
);
