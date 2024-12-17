import { defineConfig } from "vocs";
import { sidebar } from "./sidebar";

export default defineConfig({
  rootDir: "./",
  title: "Ethereum Tag Service",
  description: "Build reliable Ethereum apps & libraries with lightweight, composable, & type-safe modules from viem.",
  ogImageUrl: {
    "/": "/ets-symbol.svg",
    "/docs": "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
    "/op-stack": "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  },
  iconUrl: { light: "/ets-symbol.svg", dark: "/ets-symbol-white.svg" },
  logoUrl: { light: "/ets-symbol.svg", dark: "/ets-symbol-white.svg" },
  theme: {
    accentColor: {
      light: "#db2777",
      dark: "#db2777",
    },
  },
  topNav: [
    { text: "Docs", link: "/docs/getting-started", match: "/docs" },
    { text: "Examples", link: "https://github.com/ethereum-tag-service/examples/tree/main" },
    { text: "Explorer", link: "https://app.ets.xyz" },

    {
      text: "more",
      items: [
        {
          text: "LINK 1",
          link: "https://github.com/wevm/vocs/blob/main/src/CHANGELOG.md",
        },
        {
          text: "LINK 2",
          link: "https://github.com/wevm/vocs/blob/main/.github/CONTRIBUTING.md",
        },
      ],
    },
  ],
  sidebar,
  socials: [
    {
      icon: "github",
      link: "https://github.com/ethereum-tag-service",
    },
    /*     {
      icon: "discord",
      link: "https://discord.gg/xCUz9FRcXD",
    },
 */ {
      icon: "x",
      link: "https://x.com/etsxyz",
    },
  ],

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
