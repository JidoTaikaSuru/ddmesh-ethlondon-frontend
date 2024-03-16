export type Contracts = { [key in ContractNames]: string };
type ContractNames = "token" | "ddmeshMarket";

const contracts = {
  1: {
    token: "",
    ddmeshMarket: "",
  },
  421614: {
    token: "0x15223Dee9891d84609889798bb63ADe5e1FDcB15",
    ddmeshMarket: "0x3219cCDB1386325b9a5C46e2a6aBA2e3FF45cEf8",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
