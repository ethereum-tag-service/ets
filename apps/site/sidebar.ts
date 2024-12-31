import type { Sidebar } from "vocs";

export const sidebar = {
  "/docs/": [
    {
      text: "Introduction",
      items: [
        { text: "Getting Started", link: "/docs/getting-started" },
        { text: "Key Concepts", link: "/docs/key-concepts" },
        { text: "Roadmap", link: "/docs/roadmap" },
        { text: "FAQ", link: "/docs/faq" },
      ],
    },
    {
      text: "Guides",
      items: [
        { text: "Local Development Quickstart", link: "/docs/guides/local-dev-quickstart" },
        { text: "JavaScript Client Quickstart", link: "/docs/guides/js-client-quickstart" },
      ],
    },
    {
      text: "Smart Contracts",
      collapsed: true,
      items: [
        { text: "Introduction", link: "/docs/contracts/intro" },
        { text: "Concepts", link: "/docs/contracts/getting-started" },
        { text: "Hardhat Tasks", link: "/docs/contracts/hardhat-tasks" },
        {
          text: "Contracts Package",
          collapsed: true,

          items: [
            { text: "Installation", link: "/docs/contracts/package/installation" },
            { text: "Contants", link: "/docs/contracts/package/constants" },
            {
              text: "Chain Configuration",
              items: [
                { text: "chains", link: "/docs/contracts/package/chains" },
                { text: "networkNames", link: "/docs/contracts/package/networkNames" },
                { text: "availableChainIds", link: "/docs/contracts/package/availableChainIds" },
                { text: "availableNetworkNames", link: "/docs/contracts/package/availableNetworkNames" },
              ],
            },
            {
              text: "Utilities",
              items: [
                { text: "getChainById", link: "/docs/contracts/package/getChainById" },
                { text: "getExplorerUrl", link: "/docs/contracts/package/getExplorerUrl" },
                { text: "getAlchemyRpcUrl", link: "/docs/contracts/package/getAlchemyRpcUrl" },
                { text: "getAlchemyRpcUrlById", link: "/docs/contracts/package/getAlchemyRpcUrlById" },
              ],
            },
          ],
        },
        {
          text: "Technical Reference",
          collapsed: true,
          items: [
            { text: "Introduction", link: "/docs/contracts/reference/intro" },
            {
              text: "Core Contracts",
              items: [
                { text: "ETS", link: "/docs/contracts/reference/ETS" },
                { text: "ETSAccessControls", link: "/docs/contracts/reference/ETSAccessControls" },
                { text: "ETSAuctionHouse", link: "/docs/contracts/reference/ETSAuctionHouse" },
                { text: "ETSEnrichTarget", link: "/docs/contracts/reference/ETSEnrichTarget" },
                { text: "ETSRelayerBeacon", link: "/docs/contracts/reference/ETSRelayerBeacon" },
                { text: "ETSRelayerFactory", link: "/docs/contracts/reference/ETSRelayerFactory" },
                { text: "ETSRelayerV1", link: "/docs/contracts/reference/ETSRelayerV1" },
                { text: "ETSTarget", link: "/docs/contracts/reference/ETSTarget" },
                { text: "ETSToken", link: "/docs/contracts/reference/ETSToken" },
              ],
            },
            {
              text: "Interfaces",
              items: [
                { text: "IETS", link: "/docs/contracts/reference/IETS" },
                { text: "IETSAccessControls", link: "/docs/contracts/reference/IETSAccessControls" },
                { text: "IETSAuctionHouse", link: "/docs/contracts/reference/IETSAuctionHouse" },
                { text: "IETSEnrichTarget", link: "/docs/contracts/reference/IETSEnrichTarget" },
                { text: "IETSRelayer", link: "/docs/contracts/reference/IETSRelayer" },
                { text: "IETSTarget", link: "/docs/contracts/reference/IETSTarget" },
                { text: "IETSToken", link: "/docs/contracts/reference/IETSToken" },
                { text: "IWMATIC", link: "/docs/contracts/reference/IWMATIC" },
              ],
            },
            {
              text: "Libraries",
              items: [{ text: "UintArrayUtils", link: "/docs/contracts/reference/UintArrayUtils" }],
            },
          ],
        },
      ],
    },
    {
      text: "Applications",
      collapsed: true,
      items: [
        {
          text: "Explorer",
          items: [{ text: "Transaction Configuration", link: "/docs/apps/explorer/transactionConfig" }],
        },
      ],
    },
    {
      text: "GraphQL API",
      collapsed: true,
      items: [
        { text: "Overview", link: "/docs/api/intro" },
        { text: "Query Examples", link: "/docs/api/examples" },
        {
          text: "Subgraph Endpoints",
          items: [
            { text: "Installation", link: "/docs/api/subgraph-endpoints/installation" },
            { text: "getSubgraphEndpoint", link: "/docs/api/subgraph-endpoints/getSubgraphEndpoint" },
            { text: "subgraphEndpoints", link: "/docs/api/subgraph-endpoints/subgraphEndpoints" },
          ],
        },
      ],
    },
    {
      text: "SDK Core",
      collapsed: true,
      items: [
        { text: "Introduction", link: "/docs/sdk-core/intro" },
        { text: "Getting Started", link: "/docs/sdk-core/getting-started" },
      ],
    },
    {
      text: "SDK React Hooks",
      collapsed: true,
      items: [
        { text: "Introduction", link: "/docs/sdk-react-hooks/intro" },
        { text: "Getting Started", link: "/docs/sdk-react-hooks/getting-started" },
      ],
    },
  ],
} as const satisfies Sidebar;
