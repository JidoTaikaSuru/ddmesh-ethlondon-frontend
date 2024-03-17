export type Contracts = { [key in ContractNames]: string };
type ContractNames = "token" | "ddmeshMarket";

const contracts = {
  1: {
    token: "",
    ddmeshMarket: "",
  },
  421614: {
    token: "0x15223Dee9891d84609889798bb63ADe5e1FDcB15",
    ddmeshMarket: "0xB41CA68b89b9A026b9112E791e4813706E9e0a7b",
  },
  82554: {
    token: "0xBBB017c1db26096280852A93eF9e9A355f82C82d",
    ddmeshMarket: "0xedAD445861Fb830dD38148BD5fb7913B3C3F7Aaf",
  },
  84532: {
    //base sepolia
    token: "0xBBB017c1db26096280852A93eF9e9A355f82C82d",
    // ddmeshMarket: "0x6359a62c07AB8694746046eC7Db834112f53BfE5",
    ddmeshMarket: "0x2f77ed64b404572f86Bd5345F904d754DEc99338",
  },
  44787: {
    // celo
    token: "0x874069fa1eb16d44d622f2e0ca25eea172369bc1",
    ddmeshMarket: "0xBBB017c1db26096280852A93eF9e9A355f82C82d",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
