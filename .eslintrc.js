module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect"
    },
  },
  plugins: ["@typescript-eslint", "react", "prettier", "react-native"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
