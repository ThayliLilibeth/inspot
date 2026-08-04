/**
 * Shared ESLint base for InSpot's Node/TypeScript apps (apps/api today; apps/admin extends
 * its own Next.js-flavored config on top of this later). Consuming app must have
 * @typescript-eslint/parser and @typescript-eslint/eslint-plugin in its own devDependencies.
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    jest: true,
    es2022: true
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
};
