import { Card } from "@/components/ui/card.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useChainId, useWriteContract } from "wagmi";
import { getContracts } from "./config/contracts.config";

import { abi as tokenAbi } from "./../contracts/Token.sol/Token.json";
import { abi as ddmeshMarketAbi } from "./../contracts/DDMeshMarket.sol/DDMeshMarket.json";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export const DbProviderOnboarding = () => {
  const navigate = useNavigate();

  const { toast } = useToast();

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
    // data: hashEnterAgreement,
    // isPending: isPendingEnterAgreement,
    writeContract: writeContractEnterAgreement,
    isSuccess: isEnterAgreementSuccess,
    isError: isEnterAgreementError,
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
      writeContractEnterAgreement({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "enterAgreement",
        args: [BigInt(1), "0x6ae181072abc10a4ee84724be867c71e0d4c0471"],
      });
    }
  }, [isApproveSuccess]);

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

  // get metamask provider from wagmi
  const provider = window.ethereum;

  useCallback(async () => {
    const res = await provider?.request({
      method: "eth_getEncryptionPublicKey",
      params: ["0x6ae181072aBc10a4eE84724BE867c71E0d4C0471"],
    });

    console.log("res", res);
  }, [provider]);

  return (
    <>
      <div>
        <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
          <Checkbox style={{ height: 30, width: 30 }} />
          <Jazzicon
            diameter={60}
            seed={jsNumberForAddress(
              "0x1111111111111111111111111111111111111111"
            )}
          />
          <p className={"text-xl"}>Data Provider 1</p>
          <div className={"flex-col"}>
            <p className={"text-sm"}>Rank</p>
            <p className={"text-xl"}>#1</p>
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
            {/* <Button onClick={() => navigate(`/newDbProvider`)}>Deploy</Button> */}
            <Button onClick={() => onDeploy()}>Deploy</Button>
          </div>
        </Card>

        <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
          <Checkbox style={{ height: 30, width: 30 }} />
          <Jazzicon
            diameter={60}
            seed={jsNumberForAddress(
              "0x1111111111111111111111111111111111111111"
            )}
          />
          <p className={"text-xl"}>Data Provider 1</p>
          <div className={"flex-col"}>
            <p className={"text-sm"}>Rank</p>
            <p className={"text-xl"}>#1</p>
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
            <Button onClick={() => onDeploy()}>Deploy</Button>
          </div>
        </Card>
      </div>
    </>
  );
};
