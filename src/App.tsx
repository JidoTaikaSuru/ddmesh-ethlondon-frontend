import "./App.css";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Routes from "@/Routes";

function App() {
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
        <DynamicWagmiConnector>
          <DynamicWidget />
          <Routes />
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </div>
  );
}

export default App;
