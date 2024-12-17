import type { Sidebar } from "vocs";

export const sidebar = {
  "/docs/": [
    {
      text: "Introduction",
      items: [
        { text: "Why ETS", link: "/docs/introduction" },
        { text: "Installation", link: "/docs/installation" },
        { text: "Getting Started", link: "/docs/getting-started" },
        { text: "FAQ", link: "/docs/faq" },
      ],
    },
    {
      text: "Guides",
      items: [
        { text: "Local Dev Setup", link: "/docs/migration-guide" },
        { text: "Hardhat Tasks", link: "/docs/ethers-migration" },
      ],
    },

    {
      text: "SDK Core",
      collapsed: true,
      items: [
        { text: "Introduction", link: "/docs/actions/public/introduction" },
        {
          text: "Account",
          items: [
            {
              text: "getBalance",
              link: "/docs/actions/public/getBalance",
            },
            {
              text: "getTransactionCount",
              link: "/docs/actions/public/getTransactionCount",
            },
          ],
        },
        {
          text: "Block",
          items: [
            { text: "getBlock", link: "/docs/actions/public/getBlock" },
            {
              text: "getBlockNumber",
              link: "/docs/actions/public/getBlockNumber",
            },
            {
              text: "getBlockTransactionCount",
              link: "/docs/actions/public/getBlockTransactionCount",
            },
            {
              text: "watchBlockNumber",
              link: "/docs/actions/public/watchBlockNumber",
            },
            {
              text: "watchBlocks",
              link: "/docs/actions/public/watchBlocks",
            },
          ],
        },
        {
          text: "Call",
          items: [{ text: "call", link: "/docs/actions/public/call" }],
        },
        {
          text: "Chain",
          items: [{ text: "getChainId", link: "/docs/actions/public/getChainId" }],
        },
        {
          text: "EIP-712",
          items: [
            {
              text: "getEip712Domain",
              link: "/docs/actions/public/getEip712Domain",
            },
          ],
        },
        {
          text: "Fee",
          items: [
            {
              text: "estimateFeesPerGas",
              link: "/docs/actions/public/estimateFeesPerGas",
            },
            {
              text: "estimateGas",
              link: "/docs/actions/public/estimateGas",
            },
            {
              text: "estimateMaxPriorityFeePerGas",
              link: "/docs/actions/public/estimateMaxPriorityFeePerGas",
            },
            {
              text: "getBlobBaseFee",
              link: "/docs/actions/public/getBlobBaseFee",
            },
            {
              text: "getFeeHistory",
              link: "/docs/actions/public/getFeeHistory",
            },
            {
              text: "getGasPrice",
              link: "/docs/actions/public/getGasPrice",
            },
          ],
        },
        {
          text: "Filters & Logs",
          items: [
            {
              text: "createBlockFilter",
              link: "/docs/actions/public/createBlockFilter",
            },
            {
              text: "createEventFilter",
              link: "/docs/actions/public/createEventFilter",
            },
            {
              text: "createPendingTransactionFilter",
              link: "/docs/actions/public/createPendingTransactionFilter",
            },
            {
              text: "getFilterChanges",
              link: "/docs/actions/public/getFilterChanges",
            },
            {
              text: "getFilterLogs",
              link: "/docs/actions/public/getFilterLogs",
            },
            {
              text: "getLogs",
              link: "/docs/actions/public/getLogs",
            },
            {
              text: "watchEvent",
              link: "/docs/actions/public/watchEvent",
            },
            {
              text: "uninstallFilter",
              link: "/docs/actions/public/uninstallFilter",
            },
          ],
        },
        {
          text: "Proof",
          items: [
            {
              text: "getProof",
              link: "/docs/actions/public/getProof",
            },
          ],
        },
        {
          text: "Signature",
          items: [
            {
              text: "verifyMessage",
              link: "/docs/actions/public/verifyMessage",
            },
            {
              text: "verifyTypedData",
              link: "/docs/actions/public/verifyTypedData",
            },
          ],
        },
        {
          text: "Transaction",
          items: [
            {
              text: "prepareTransactionRequest",
              link: "/docs/actions/wallet/prepareTransactionRequest",
            },
            {
              text: "getTransaction",
              link: "/docs/actions/public/getTransaction",
            },
            {
              text: "getTransactionConfirmations",
              link: "/docs/actions/public/getTransactionConfirmations",
            },
            {
              text: "getTransactionReceipt",
              link: "/docs/actions/public/getTransactionReceipt",
            },
            {
              text: "sendRawTransaction",
              link: "/docs/actions/wallet/sendRawTransaction",
            },
            {
              text: "waitForTransactionReceipt",
              link: "/docs/actions/public/waitForTransactionReceipt",
            },
            {
              text: "watchPendingTransactions",
              link: "/docs/actions/public/watchPendingTransactions",
            },
          ],
        },
      ],
    },
    {
      text: "SDK React Hooks",
      collapsed: true,
      items: [
        { text: "Introduction", link: "/docs/actions/test/introduction" },
        {
          text: "Account",
          items: [
            {
              text: "impersonateAccount",
              link: "/docs/actions/test/impersonateAccount",
            },
            { text: "setBalance", link: "/docs/actions/test/setBalance" },
            { text: "setCode", link: "/docs/actions/test/setCode" },
            { text: "setNonce", link: "/docs/actions/test/setNonce" },
            {
              text: "setStorageAt",
              link: "/docs/actions/test/setStorageAt",
            },
            {
              text: "stopImpersonatingAccount",
              link: "/docs/actions/test/stopImpersonatingAccount",
            },
          ],
        },
        {
          text: "Block",
          items: [
            { text: "getAutomine", link: "/docs/actions/test/getAutomine" },
            {
              text: "increaseTime",
              link: "/docs/actions/test/increaseTime",
            },
            { text: "mine", link: "/docs/actions/test/mine" },
            {
              text: "removeBlockTimestampInterval",
              link: "/docs/actions/test/removeBlockTimestampInterval",
            },
            { text: "setAutomine", link: "/docs/actions/test/setAutomine" },
            {
              text: "setIntervalMining",
              link: "/docs/actions/test/setIntervalMining",
            },
            {
              text: "setBlockTimestampInterval",
              link: "/docs/actions/test/setBlockTimestampInterval",
            },
            {
              text: "setBlockGasLimit",
              link: "/docs/actions/test/setBlockGasLimit",
            },
            {
              text: "setNextBlockBaseFeePerGas",
              link: "/docs/actions/test/setNextBlockBaseFeePerGas",
            },
            {
              text: "setNextBlockTimestamp",
              link: "/docs/actions/test/setNextBlockTimestamp",
            },
          ],
        },
        {
          text: "Node",
          items: [
            { text: "setCoinbase", link: "/docs/actions/test/setCoinbase" },
            {
              text: "setMinGasPrice",
              link: "/docs/actions/test/setMinGasPrice",
            },
          ],
        },
        {
          text: "Settings",
          items: [
            { text: "reset", link: "/docs/actions/test/reset" },
            {
              text: "setLoggingEnabled",
              link: "/docs/actions/test/setLoggingEnabled",
            },
            { text: "setRpcUrl", link: "/docs/actions/test/setRpcUrl" },
          ],
        },
        {
          text: "State",
          items: [
            { text: "dumpState", link: "/docs/actions/test/dumpState" },
            { text: "loadState", link: "/docs/actions/test/loadState" },
            { text: "revert", link: "/docs/actions/test/revert" },
            { text: "snapshot", link: "/docs/actions/test/snapshot" },
          ],
        },
        {
          text: "Transaction",
          items: [
            {
              text: "dropTransaction",
              link: "/docs/actions/test/dropTransaction",
            },
            {
              text: "getTxpoolContent",
              link: "/docs/actions/test/getTxpoolContent",
            },
            {
              text: "getTxpoolStatus",
              link: "/docs/actions/test/getTxpoolStatus",
            },
            {
              text: "inspectTxpool",
              link: "/docs/actions/test/inspectTxpool",
            },
            {
              text: "sendUnsignedTransaction",
              link: "/docs/actions/test/sendUnsignedTransaction",
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Sidebar;
