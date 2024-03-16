import { Card } from "@/components/ui/card.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { getContracts } from "./config/contracts.config";

import { abi as tokenAbi } from "./../contracts/Token.sol/DDMTOKEN.json";
import { abi as ddmeshMarketAbi } from "./../contracts/DDMeshMarket.sol/DDMeshMarket.json";

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

export const DbProviderOnboarding = () => {
  const { toast } = useToast();
  const [providerChoice, setProviderChoice] = useState<bigint>(BigInt(0));

  const chainId = useChainId();

  const tokenAddress = getContracts(chainId).token as `0x${string}`;
  const ddmeshMarketAddress = getContracts(chainId)
    .ddmeshMarket as `0x${string}`;
  console.log("ddmeshMarketAddress", ddmeshMarketAddress);

  const {
    data: hash,
    isPending: isPendingApprove,
    writeContract: writeContractApprove,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  const {
    writeContract: writeContractEnterAgreement,
    isSuccess: isEnterAgreementSuccess,
    isError: isEnterAgreementError,
    error: enterAgreementError,
  } = useWriteContract();

  const onDeploy = async () => {
    writeContractApprove({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "approve",
      args: [ddmeshMarketAddress, BigInt(1)],
    });
  };

  useEffect(() => {
    if (
      isApproveSuccess &&
      !isPendingApprove &&
      !isEnterAgreementError &&
      !isEnterAgreementSuccess
    ) {
      console.log(
        "Approve success, entering agreement now. providerChoice: ",
        providerChoice
      );
      writeContractEnterAgreement({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "enterAgreement",
        args: [providerChoice, BigInt(1)],
      });
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isEnterAgreementError) {
      console.log("Error entering agreement", isEnterAgreementError);
      console.log("Error entering agreement", enterAgreementError);
    }
  }, [isEnterAgreementError]);

  // as soon as isEnterAgreementSuccess is true, we show a success message to the user
  useEffect(() => {
    if (isEnterAgreementSuccess && !isEnterAgreementError) {
      console.log("Successfully entered agreement and paid");
      toast({
        title: "SuccessFully Paid For Agreement",
        description: "Friday, February 10, 2023 at 5:57 PM",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
        color: "success",
      });
    }
  }, [isEnterAgreementSuccess]);

  const { data: providers } = useReadContract({
    address: ddmeshMarketAddress,
    abi: ddmeshMarketAbi,
    functionName: "getAllProviders",
    args: [],
  });

  return (
    <>
      <h1 className={"text-3xl"}>Data Providers</h1>
      <div>
        {(providers as Provider[]) &&
          providers?.map((provider: Provider, index: number) => {
            return (
              <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
                <Checkbox style={{ height: 30, width: 30 }} />
                <Jazzicon
                  diameter={60}
                  seed={jsNumberForAddress(provider.pAddress)}
                />
                <p className={"text-xl"}>{provider.ensName}</p>
                <div className={"flex-col"}>
                  <p className={"text-sm"}>Rank</p>
                  <p className={"text-xl"}>#{index + 1}</p>
                </div>
                <div className={"flex-col align-middle justify-center"}>
                  <p className={"text-sm"}>Database</p>
                  <img style={{ height: 25 }} src={PostgresLogo} />
                </div>
                <div className={"flex-col"}>
                  <p className={"text-sm"}>Storage Available</p>
                  <p className={"text-xl"}>100GB</p>
                </div>
                <div className={"flex-col"}>
                  <p className={"text-sm"}>Storage Price</p>
                  <p className={"text-xl flex"}>
                    <img className={"h-5"} src={UsdcLogo} />
                    <p>0.001/min</p>
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setProviderChoice(provider.id);
                      onDeploy();
                    }}
                  >
                    Deploy
                  </Button>
                </div>
              </Card>
            );
          })}
      </div>
    </>
  );
};
