import { Card } from "@/components/ui/card.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import { getContracts } from "./config/contracts.config";

import { abi as tokenAbi } from "../contracts/Token.sol/DDMTOKEN.json";
import { abi as ddmeshMarketAbi } from "../contracts/DDMeshMarket.sol/DDMeshMarket.json";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type Provider = {
  id: bigint;
  pAddress: string;
  fee: bigint; // DDM Tokens
  encApiKey: string;
  ensName: string;
  description: string;
  noOfDbAgreements: bigint;
  activeAgreements: bigint;
};

type Agreement = {
  id: bigint; // or number, if within JS safe integer range
  user: string; // Address as a string
  userBalance: bigint; // or number
  providerAddress: string; // Address as a string
  providerId: bigint; // or number
  providerClaimed: bigint; // or number
  encConnectionString: string;
  startTimeStamp: bigint; // or number, timestamp as number is usually safe
  status: AgreementStatus;
};

enum AgreementStatus {
  NONE,
  ENTERED,
  ACTIVE,
  CLOSED,
  REVOKED,
  ERROR,
}

export const UserAgreements = () => {
  const { toast } = useToast();
  const [providerChoice, setProviderChoice] = useState<bigint>(BigInt(0));

  const chainId = useChainId();

  const tokenAddress = getContracts(chainId).token as `0x${string}`;
  const ddmeshMarketAddress = getContracts(chainId)
    .ddmeshMarket as `0x${string}`;
  console.log("ddmeshMarketAddress", ddmeshMarketAddress);

  // const {
  //   isPending: isPendingApprove,
  //   writeContract: writeContractApprove,
  //   isSuccess: isApproveSuccess,
  // } = useWriteContract();

  // const {
  //   writeContract: writeContractEnterAgreement,
  //   isSuccess: isEnterAgreementSuccess,
  //   isError: isEnterAgreementError,
  // } = useWriteContract();

  const onDeploy = async () => {
    // writeContractApprove({
    //   address: tokenAddress,
    //   abi: tokenAbi,
    //   functionName: "approve",
    //   args: [ddmeshMarketAddress, BigInt(1)],
    // });
  };

  const { data: userAgreements } = useReadContract({
    address: ddmeshMarketAddress,
    abi: ddmeshMarketAbi,
    functionName: "getUserAgreements",
    args: [],
  });

  return (
    <>
      <h1 className={"text-3xl"}>User Agreements</h1>
      <div>
        {/* show the agreements in cards using now the agreement type and show all Agreement props of userAgreements:
        show user, userbalance, providerAddress, providerClaimed, status, encConnectionString, startTimeStamp,  */}
        {/* type Agreement = {
  id: bigint; // or number, if within JS safe integer range
  user: string; // Address as a string
  userBalance: bigint; // or number
  providerAddress: string; // Address as a string
  providerId: bigint; // or number
  providerClaimed: bigint; // or number
  encConnectionString: string;
  startTimeStamp: bigint; // or number, timestamp as number is usually safe
  status: AgreementStatus;
};

enum AgreementStatus {
  NONE,
  ENTERED,
  ACTIVE,
  CLOSED,
  REVOKED,
  ERROR,
} */}
        {(userAgreements as Agreement[]) &&
          userAgreements?.map((userAgreement: Agreement, index: number) => {
            return (
              <Card
                key={index}
                className={"p-4 flex items-center leading-4 gap-x-2"}
              >
                LL
              </Card>
            );
          })}
      </div>
    </>
  );
};
