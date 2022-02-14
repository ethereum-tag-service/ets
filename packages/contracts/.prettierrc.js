module.exports = {
  overrides: [
    {
      files: '*.sol',
      options: {
        printWidth: 120,
        tabWidth: 4,
        singleQuote: false,
        explicitTypes: 'always',
      },
    },
    {
      files: ["*.js", "*.ts"],
      options: {
        "trailingComma": "all",
        "tabWidth": 2,
        "semi": true,
        "singleQuote": false,
        "printWidth": 120
      }
    },
  ],
};
