// vocs.config.ts
import { defineConfig } from "file:///Users/User/Sites/ets/node_modules/.pnpm/vocs@1.0.0-alpha.54_@types+node@20.12.7_@types+react@18.2.12_react-dom@18.2.0_react@18.2.0_typescript@5.5.4/node_modules/vocs/_lib/index.js";
var vocs_config_default = defineConfig({
  rootDir: "./",
  title: "Ethereum Tag Service",
  iconUrl: { light: "/favicons/ets-symbol.svg", dark: "/favicons/ets-symbol-white.svg" },
  topNav: [
    /* { text: "Concepts", link: "/concepts", match: "/concepts" },
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
    }, */
  ],
  sidebar: {
    "/concepts": [
      {
        text: "ETS Overview",
        link: "/concepts/"
      }
    ],
    "/sdks": [
      {
        text: "Introduction",
        link: "/sdks"
      },
      {
        text: "SDK Core",
        //collapsed: false,
        items: [
          {
            text: "Getting Started",
            link: "/sdks/core/getting-started"
          }
        ]
      },
      {
        text: "SDK React",
        //collapsed: false,
        items: [
          {
            text: "Getting Started",
            link: "/sdks/react/getting-started"
          }
        ]
      }
    ]
  }
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
export {
  vocs_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvVXNlci9TaXRlcy9ldHMvYXBwcy9zaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvVXNlci9TaXRlcy9ldHMvYXBwcy9zaXRlL3ZvY3MuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9Vc2VyL1NpdGVzL2V0cy9hcHBzL3NpdGUvdm9jcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidm9jc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290RGlyOiBcIi4vXCIsXG4gIHRpdGxlOiBcIkV0aGVyZXVtIFRhZyBTZXJ2aWNlXCIsXG4gIGljb25Vcmw6IHsgbGlnaHQ6IFwiL2Zhdmljb25zL2V0cy1zeW1ib2wuc3ZnXCIsIGRhcms6IFwiL2Zhdmljb25zL2V0cy1zeW1ib2wtd2hpdGUuc3ZnXCIgfSxcbiAgdG9wTmF2OiBbXG4gICAgLyogeyB0ZXh0OiBcIkNvbmNlcHRzXCIsIGxpbms6IFwiL2NvbmNlcHRzXCIsIG1hdGNoOiBcIi9jb25jZXB0c1wiIH0sXG4gICAgeyB0ZXh0OiBcIlNES3NcIiwgbGluazogXCIvc2Rrc1wiLCBtYXRjaDogXCIvc2Rrc1wiIH0sXG4gICAgeyB0ZXh0OiBcIkFQSVwiLCBsaW5rOiBcIi9hcGkvZ2V0dGluZy1zdGFydGVkXCIsIG1hdGNoOiBcIi9hcGlcIiB9LFxuICAgIHsgdGV4dDogXCJDb250cmFjdHNcIiwgbGluazogXCIvY29udHJhY3RzL1wiLCBtYXRjaDogXCIvY29udHJhY3RzXCIgfSxcbiAgICB7XG4gICAgICB0ZXh0OiBcIm1vcmVcIixcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIkNoYW5nZWxvZ1wiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3dldm0vdm9jcy9ibG9iL21haW4vc3JjL0NIQU5HRUxPRy5tZFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJDb250cmlidXRpbmdcIixcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS93ZXZtL3ZvY3MvYmxvYi9tYWluLy5naXRodWIvQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sICovXG4gIF0sXG4gIHNpZGViYXI6IHtcbiAgICBcIi9jb25jZXB0c1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiRVRTIE92ZXJ2aWV3XCIsXG4gICAgICAgIGxpbms6IFwiL2NvbmNlcHRzL1wiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiL3Nka3NcIjogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiBcIkludHJvZHVjdGlvblwiLFxuICAgICAgICBsaW5rOiBcIi9zZGtzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIlNESyBDb3JlXCIsXG4gICAgICAgIC8vY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkdldHRpbmcgU3RhcnRlZFwiLFxuICAgICAgICAgICAgbGluazogXCIvc2Rrcy9jb3JlL2dldHRpbmctc3RhcnRlZFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIlNESyBSZWFjdFwiLFxuICAgICAgICAvL2NvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJHZXR0aW5nIFN0YXJ0ZWRcIixcbiAgICAgICAgICAgIGxpbms6IFwiL3Nka3MvcmVhY3QvZ2V0dGluZy1zdGFydGVkXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICAvKiAgIFtcbiAgICB7XG4gICAgICB0ZXh0OiBcIkdldHRpbmcgU3RhcnRlZFwiLFxuICAgICAgbGluazogXCIvZ2V0dGluZy1zdGFydGVkXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiBcIkV4YW1wbGVcIixcbiAgICAgIGxpbms6IFwiL2V4YW1wbGVcIixcbiAgICB9LFxuICBdLCAqL1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStRLFNBQVMsb0JBQW9CO0FBRTVTLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVMsRUFBRSxPQUFPLDRCQUE0QixNQUFNLGlDQUFpQztBQUFBLEVBQ3JGLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFrQlI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGFBQWE7QUFBQSxNQUNYO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQTtBQUFBLFFBRU4sT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUE7QUFBQSxRQUVOLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
