// Uses a relative path (not the bare "@inspot/config/eslint-node" specifier) because ESLint's
// shareable-config name normalization expects package names to follow the "eslint-config-*"
// convention and mangles anything else — a path bypasses that resolution entirely.
module.exports = {
  root: true,
  extends: [require.resolve("@inspot/config/eslint-node")],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  // Config files (this file included) aren't part of tsconfig.json's program, so
  // parserOptions.project can't find them. Per typescript-eslint's typed-linting
  // guide, disable type-aware linting for just those files instead of dropping
  // `project` for the whole app: https://typescript-eslint.io/troubleshooting/typed-linting/#parseroptionsproject
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
};
