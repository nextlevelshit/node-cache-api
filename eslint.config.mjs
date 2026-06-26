import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/*.test.ts", "coverage/**", "dist/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      // no-undef is handled by the TypeScript compiler; disabling avoids
      // false positives on global/ambient types (recommended by typescript-eslint).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_|^req$|^res$|^next$" },
      ],
    },
  },
);
