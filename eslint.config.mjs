import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
      "@typescript-eslint/no-unused-expressions": "warn", // ✅ Converts error to warning
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // ✅ Ignores `_` prefixed variables
      "@typescript-eslint/no-explicit-any": "off", // ✅ Disables restriction on `any`
      "prefer-const": "warn", // ✅ Suggests using `const` instead of `let` if variable is never reassigned
      "@typescript-eslint/no-this-alias": "off", // ✅ Disables warning for aliasing `this`
    },
  },
];

export default eslintConfig;
