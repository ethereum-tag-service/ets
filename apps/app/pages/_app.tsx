import { Router } from "next/router";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { SWRConfig } from "swr";
import { fetcher } from "@app/utils/fetchers";

import "@app/styles/globals.css";
import nProgress from "nprogress";

//import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { RainbowKitProvider, connectorsForWallets, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import merge from "lodash.merge";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { createConfig, WagmiConfig, WagmiProvider } from "wagmi";
import { hardhat, polygonMumbai } from "wagmi/chains";
import { wagmiConfig } from "@app/constants/wagmiConfig";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";

//Wagmi uses tenstack's react-query for caching and fetching data
const queryClient = new QueryClient() 

//Configure the chain and the RPC provider. Note that we've added localhost here
// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [...(process.env.NEXT_PUBLIC_ETS_ENVIRONMENT === "development" ? [hardhat] : [polygonMumbai])],
//   [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || "" }), publicProvider()],
// );

// const initialChain = process.env.NEXT_PUBLIC_ETS_ENVIRONMENT === "development" ? hardhat : polygonMumbai;

const projectId = "1";

//const { wallets } = getDefaultWallets({
//  appName: "ETS",
//  projectId,
//  chains,
//});

const appInfo = {
  appName: "ETS",
  learnMoreUrl: "https://ets.xyz",
};

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended",
//     wallets: [metaMaskWallet({ projectId, chains })],
//   },
// ]);

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   webSocketPublicClient,
// });

//const getSiweMessageOptions: GetSiweMessageOptions = () => ({
//  statement: "Sign in to Ethereum Tag Service",
//});

// Custom theming for Rainbow connect button.
const etsTheme = merge(
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
      connectButtonBackground: "btn",
    },
    fonts: {
      body: "Inter var, system-ui, sans-serif",
    },
    shadows: {
      connectButton: "none",
    },
  } as Theme,
);

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {/*
      // ! SIWE was enabled and working, but disabling for now till we really need it.
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
      */}
      <QueryClientProvider client={queryClient}> 
        <RainbowKitProvider
          appInfo={appInfo}
          chains={[hardhat, polygonMumbai]}
          modalSize="compact"
          theme={etsTheme}
          initialChain={polygonMumbai}
        >
          <SWRConfig value={{ refreshInterval: 3000, fetcher: fetcher }}>
            <Component {...pageProps} />
          </SWRConfig>
        </RainbowKitProvider>
        {/*
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
        */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
