export type Contracts = { [key in ContractNames]: string };
type ContractNames = "token" | "ddmeshMarket";

const contracts = {
  1: {
    token: "",
    ddmeshMarket: "",
  },
  421614: {
    token: "0x15223Dee9891d84609889798bb63ADe5e1FDcB15",
    ddmeshMarket: "0x9D4E1636bf4949D466D26359e5ee9558776755F0",
  },
  82554: {
    token: "0xBBB017c1db26096280852A93eF9e9A355f82C82d",
    ddmeshMarket: "0x15223Dee9891d84609889798bb63ADe5e1FDcB15",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
