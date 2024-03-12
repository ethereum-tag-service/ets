import { http, createConfig, Config, fallback } from "@wagmi/core";
import { polygonMumbai, hardhat } from "@wagmi/core/chains";
import { lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { injected } from "@wagmi/connectors";
import merge from "lodash.merge";

// Wagmi Config
export const wagmiConfig: Config = createConfig({
  chains: [process.env.NEXT_PUBLIC_ETS_ENVIRONMENT === "development" ? hardhat : polygonMumbai],
  connectors: [injected()],
  transports: {
    [polygonMumbai.id]: fallback([http("https://polygon-mumbai-pokt.nodies.app/")]),
    [hardhat.id]: http("http://localhost:8545"),
  },
});

export const etsTheme = merge(
  lightTheme({
    accentColorForeground: "white",
    borderRadius: "medium",
    fontStack: "system",
  }),
  {
    colors: {
      accentColor: "#db2979",
      actionButtonSecondaryBackground: "#db2979",
      closeButton: "#db2979",
      connectButtonBackground: "#db2979",
    },
    fonts: {
      body: "Inter var, system-ui, sans-serif",
    },
    shadows: {
      connectButton: "none",
    },
  } as Theme,
);