import type { Session } from "next-auth";
import type { AppProps } from "next/app";
import { Router } from "next/router";

import { fetcher } from "@app/utils/fetchers";
import { SWRConfig } from "swr";

import "@app/styles/globals.css";
import "@app/styles/tags.css";
import nProgress from "nprogress";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "@app/config/wagmiConfig";
import { AuctionHouseProvider } from "@app/context/AuctionHouseContext";
import { ModalProvider } from "@app/context/ModalContext";
import { TransactionManagerProvider } from "@app/context/TransactionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { arbitrumSepolia, hardhat } from "viem/chains";
import { WagmiProvider } from "wagmi";

const SystemProvider = dynamic(() => import("@app/context/SystemContext").then((mod) => mod.SystemProvider), {
  ssr: false,
});

const initialChain = process.env.NEXT_PUBLIC_ETS_ENVIRONMENT === "development" ? hardhat : arbitrumSepolia;

const queryClient = new QueryClient();

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={initialChain}>
          <SWRConfig value={{ refreshInterval: 3000, fetcher: fetcher }}>
            <SystemProvider>
              <TransactionManagerProvider>
                <AuctionHouseProvider>
                  <ModalProvider>
                    <Component {...pageProps} />
                  </ModalProvider>
                </AuctionHouseProvider>
              </TransactionManagerProvider>
            </SystemProvider>
          </SWRConfig>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
