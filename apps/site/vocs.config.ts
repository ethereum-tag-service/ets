import { defineConfig } from "vocs";
export default defineConfig({
  rootDir: "./",
  title: "Ethereum Tag Service",
  iconUrl: { light: "/ets-symbol.svg", dark: "/ets-symbol-white.svg" },
  logoUrl: { light: "/ets-symbol.svg", dark: "/ets-symbol-white.svg" },
  theme: {
    accentColor: {
      light: "#db2777",
      dark: "#db2777",
    },
  },
  topNav: [
    { text: "Concepts", link: "/concepts", match: "/concepts" },
    { text: "SDKs", link: "/sdks", match: "/sdks" },
    { text: "API", link: "/api/getting-started", match: "/api" },
    { text: "Contracts", link: "/contracts/", match: "/contracts" },
    {
      text: "more",
      items: [
        {
          text: "Changelog",
          link: "https://github.com/wevm/vocs/blob/main/src/CHANGELOG.md",
        },
        {
          text: "Contributing",
          link: "https://github.com/wevm/vocs/blob/main/.github/CONTRIBUTING.md",
        },
      ],
    },
  ],
  sidebar: {
    "/concepts": [
      {
        text: "ETS Overview",
        link: "/concepts/",
      },
    ],
    "/sdks": [
      {
        text: "Introduction",
        link: "/sdks",
      },
      {
        text: "SDK Core",
        //collapsed: false,
        items: [
          {
            text: "Getting Started",
            link: "/sdks/core/getting-started",
          },
        ],
      },
      {
        text: "SDK React",
        //collapsed: false,
        items: [
          {
            text: "Getting Started",
            link: "/sdks/react/getting-started",
          },
        ],
      },
    ],
  },

  /*   [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Example",
      link: "/example",
    },
  ], */
});
