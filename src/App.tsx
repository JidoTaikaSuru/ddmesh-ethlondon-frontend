//@ts-ignore
import "./App.css";

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
import DDMeshLogo from "./assets/ddmesh-logo-fixed.svg";
import { Link } from "react-router-dom";

import { type Chain } from "viem";

export const ddmeshOrbit = {
  id: 82554,
  name: "DDMesh Orbit",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-dd-mesh-4ulujj9fnb.t.conduit.xyz/"] },
  },
  blockExplorers: {
    default: {
      name: "DdMeshScan",
      url: "https://explorerl2new-dd-mesh-4ulujj9fnb.t.conduit.xyz/",
    },
  },
} as const satisfies Chain;

const config = createConfig({
  chains: [mainnet, ddmeshOrbit, arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    1: http(),
    82554: http(),
    421614: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <div className={"container"}>
      {/*@ts-ignore*/}
      <DynamicContextProvider
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          walletConnectors: [EthereumWalletConnectors],
          environmentId: "95ae4a76-ade0-49e2-be66-46e32f2418df",
          overrides: {
            evmNetworks: [
              {
                blockExplorerUrls: [
                  "https://explorerl2new-dd-mesh-4ulujj9fnb.t.conduit.xyz/",
                ],
                chainId: 82554,
                chainName: "DDMesh Orbit",
                iconUrls: ["https://svgshare.com/i/14RW.svg"],
                name: "DDMesh Orbit",
                nativeCurrency: {
                  decimals: 18,
                  name: "Ether",
                  symbol: "ETH",
                },
                networkId: 82554,
                rpcUrls: ["https://rpc-dd-mesh-4ulujj9fnb.t.conduit.xyz/"],
                vanityName: "DDMesh Orbit",
              },
              {
                chainId: 421614,
                chainName: "Arbitrum Sepolia",
                iconUrls: [
                  "https://app.dynamic.xyz/assets/networks/arbitrum.svg",
                ],
                name: "Arbitrum Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                networkId: 421614,
                rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
                blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
                vanityName: "Arbitrum Sepolia",
              },
            ],
          },
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <div
                className={"flex p-2 border-b-2 mb-8 items-center text-primary"}
              >
                <Link to={"/"} className={"flex space-x-2 items-center"}>
                  <img src={DDMeshLogo} className={"h-10"} />
                  <p className={"text-3xl"}>ddMesh</p>
                </Link>
                <div style={{ marginLeft: "auto" }}>
                  <DynamicWidget />
                </div>
              </div>
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
