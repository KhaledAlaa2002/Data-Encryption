import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disallow the use of 'any' type in TypeScript
      "@typescript-eslint/no-explicit-any": "false",

      // Warn about unused variables (like 'err')
      "@typescript-eslint/no-unused-vars": ["false", { argsIgnorePattern: "^_" }] // Optionally, you can allow unused variables that start with an underscore
    },
  },
];

export default eslintConfig;
