import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js"; 
import jest, { rules } from "eslint-plugin-jest"

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
     files: ["src/tests**/*.{js,ts}"],
     ...jest.configs["flat/recommended"],
     rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",

     }
  },
  js.configs.recommended,     
  ...tseslint.configs.recommended,
];