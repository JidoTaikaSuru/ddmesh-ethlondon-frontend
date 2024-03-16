export type Contracts = { [key in ContractNames]: string };
type ContractNames = "token" | "ddmeshMarket";

const contracts = {
  1: {
    token: "",
    ddmeshMarket: "",
  },
  421614: {
    token: "0x601c2f884f68308c64d662bb6073e108955e3ed7",
    ddmeshMarket: "0xDb5DBA8dd7672D01E3B1199Abd0C718146B67997",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
