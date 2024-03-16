import "./App.css";

import { useState } from "react";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { arbitrumSepolia, mainnet } from "viem/chains";
import Routes from "@/Routes";
import { Toaster } from "./components/ui/toaster";

const config = createConfig({
  chains: [mainnet, arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    1: http(),
    421614: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className={"container border-2"}>
      <DynamicContextProvider
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          environmentId: "95ae4a76-ade0-49e2-be66-46e32f2418df",
          walletConnectors: [EthereumWalletConnectors],
          evmNetworks: [
            {
              chainId: 421614,
              networkId: "421614",
              name: "arbitrumSepolia",
              iconUrls: [],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
              blockExplorerUrls: [],
            },
          ],
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <DynamicWidget />
              <Routes />
              <Toaster />
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </div>
  );
}

export default App;
