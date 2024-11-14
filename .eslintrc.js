module.exports = {
  parser: "@typescript-eslint/parser", // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 2020, // Modern ECMAScript support
    sourceType: "module", // Enable ECMAScript modules
  },
  settings: {
    "import/resolver": {
      typescript: {}, // This allows eslint to resolve TypeScript modules
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  rules: {
    // Add or adjust rules here
  },
};
