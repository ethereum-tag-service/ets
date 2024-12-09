module.exports = {
  plugins: ["prettier-plugin-solidity"],
  overrides: [
    {
      files: "*.sol",
      options: {
        parser: "solidity-parse",
        printWidth: 120,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: true,
        explicitTypes: "always",
        semi: false,
      },
    },
    {
      files: ["*.js", "*.ts"],
      options: {
        trailingComma: "all",
        tabWidth: 2,
        semi: true,
        singleQuote: false,
        printWidth: 120,
        quoteProps: "preserve",
      },
    },
    {
      files: "*.md",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
