import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import SupabaseLogo from "@/assets/supabase.svg";
import AwsLogo from "@/assets/aws.svg";
import DatabaseLogo from "@/assets/database.svg";
import { IconButton, RenderMESHInMonth, RenderMESHInWeek } from "@/common.tsx";
import { FC, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeonClient } from "@/NeonClient.tsx";

import { useChainId, useWriteContract } from "wagmi";
import { getContracts } from "./config/contracts.config";

import { abi as ddmeshMarketAbi } from "./../contracts/DDMeshMarket.sol/DDMeshMarket.json";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  provider: z.string().min(1),
  ens: z.string().min(1),
  apiKey: z.string().min(1),
  // fee: z.number().positive(), //TODO This is broken
  fee: z.string().default("0"),
  max_databases: z.string().default("1"), //TODO Make this into a number later
});

//TODO this control is fucked, reports status for two distinct processes.
// @Maarten, should we use toasts instead of rendering status in this way?
const RenderNeonVerification: FC<{ status: string; error: string }> = ({
  status,
  error,
}) => {
  if (status === "error") {
    // TODO Fix the color here, use the tailwind color
    return (
      <p
        style={{
          color: "red",
        }}
      >
        {error}
      </p>
    );
  }
  if (status === "pending") {
    return <p>Verifying neon credentials...</p>;
  }
  if (status === "warn_on_multiple_dbs") {
    return (
      <p
        style={{
          color: "orange",
        }}
      >
        You already have the max amount of databases set up for your account
        tier
      </p>
    );
  }
  if (status === "complete") {
    // TODO Fix the color here, use the tailwind color
    return <p style={{ color: "green" }}>Verified!</p>;
  }
  if (status === "wipe_complete") {
    return <p style={{ color: "green" }}>Wiped all databases successfully!</p>;
  }
  return <p></p>;
};

export const NewDbProvider = () => {
  const [step, setStep] = useState(1);
  const [neonVerificationStatus, setNeonVerificationStatus] =
    useState("not_started");
  const [neonVerificationError, setNeonVerificationError] = useState("");

  const { toast } = useToast();

  const chainId = useChainId();

  // const [dbHost, setDbHost] = useState("supabase")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      ens: "",
      apiKey: "",
      fee: "0",
      max_databases: "1",
    },
  });

  const ddmeshMarketAddress = getContracts(chainId)
    .ddmeshMarket as `0x${string}`;

  const {
    isPending: isPendingRegister,
    writeContract: writeContractRegister,
    isSuccess: isRegisterSuccess,
  } = useWriteContract();

  const registerProvider = async () => {
    writeContractRegister({
      address: ddmeshMarketAddress,
      abi: ddmeshMarketAbi,
      functionName: "registerProvider",
      args: [
        BigInt(form.watch("fee")),
        form.watch("apiKey"),
        form.watch("ens"),
        form.watch("provider"),
        BigInt(form.watch("max_databases")),
      ],
    });
  };

  useEffect(() => {
    if (!isPendingRegister && isRegisterSuccess) {
      toast({
        title: "Provider registered successfully",
        description: "Thank you for registering a client will contact you soon",
      });
    }
  }, [isPendingRegister]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Doing basic checks against Neon...");
    const neonClient = new NeonClient(data.apiKey);
    setNeonVerificationStatus("pending");
    try {
      //Check if user has set up a project
      const projectId = await neonClient.getFirstProjectId();
      console.log("Found project id:", projectId);
      //Check if user has set up a branch
      const branchId = await neonClient.getFirstBranchId(projectId);
      console.log("Found branch id:", branchId);
      //Check if user has set up a database
      const databaseCount = await neonClient.getCurrentNumberOfDeployedDBs(
        projectId,
        branchId
      );
      console.log(
        `User has`,
        databaseCount,
        "databases set up out of an allowed",
        data.max_databases,
        "databases."
      );

      if (databaseCount >= parseInt(data.max_databases)) {
        setNeonVerificationStatus("error");
        setNeonVerificationError(
          `You have the max amount of databases set up for your account tier (${databaseCount}/${data.max_databases}), please delete one before continuing`
        );
        return;
      }
      setNeonVerificationError("");
      setNeonVerificationStatus("complete");
      //@Maarten, right here, at this point the user has been verified and we can continue with the next steps
      // 1. Encrypt the apiKey with our public key: 0x1b6bB595fFD8a0dCDeac79f805d35c5101273F9a
      // 2. approve() w/ max val just so we don't have to worry about it later (we'll require collateral/staking later)
      // 3. Register the provider using the properties of "data", MAKE SURE THE API KEY IS ENCRYPTED IN THE PAYLOAD YOU PASS TO THE CONTRACT
      await registerProvider();
      setStep(3);
    } catch (e: any) {
      console.error(e);
      setNeonVerificationStatus("error");
      setNeonVerificationError(e.message);
    }
  };

  const wipeAllNeonDatabases = async (apiKey: string) => {
    console.log("User wants to start fresh in Neon, apiKey:", apiKey);
    console.log("Doing basic checks against Neon...");
    const neonClient = new NeonClient(apiKey);
    setNeonVerificationStatus("pending");
    try {
      //Check if user has set up a project
      const projectId = await neonClient.getFirstProjectId();
      console.log("Found project id:", projectId);
      //Check if user has set up a branch
      const branchId = await neonClient.getFirstBranchId(projectId);
      console.log("Found branch id:", branchId);
      await neonClient.wipeAllDatabases(projectId, branchId);
      //Check if user has set up a database
      setNeonVerificationError("");
      setNeonVerificationStatus("wipe_complete");
    } catch (e: any) {
      console.error(e);
      setNeonVerificationStatus("error");
      setNeonVerificationError(e.message);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex-col">
          {/*DATABASE PROVIDER CARD*/}
          <Card className="w-96">
            <p
              onClick={() => {
                if (step !== 1) {
                  setStep(step - 1);
                }
              }}
            >
              Back...
            </p>

            <CardHeader>
              <CardTitle>Pick a database host</CardTitle>
              <CardDescription>Step {step}/3</CardDescription>
            </CardHeader>
            {(() => {
              if (step === 1) {
                return (
                  <CardContent className="flex flex-col items-center space-y-2">
                    <IconButton
                      icon={SupabaseLogo}
                      text={"Supabase"}
                      buttonProps={{
                        onClick: () => setStep(2),
                      }}
                    />
                    <IconButton
                      icon={AwsLogo}
                      text={"AWS"}
                      buttonProps={{ disabled: true }}
                    />
                    <IconButton
                      icon={DatabaseLogo}
                      text={"Bare Metal"}
                      buttonProps={{ disabled: true }}
                    />
                  </CardContent>
                );
              } else if (step === 2) {
                return (
                  <CardContent className={"flex flex-col space-y-2"}>
                    <Form {...form}>
                      {/*TODO get decorator for feeToken here*/}
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your provider name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your provider name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is a friendly name that will be shown to
                                others
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ens"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ENS</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ENS (optional)"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                ENS record that resolves to your internal
                                provider id
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Neon API Key</FormLabel>
                              <FormControl>
                                <Input placeholder="Neon API Key" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your Neon API key, see{" "}
                                <a
                                  href={
                                    "https://summer-salute-f85.notion.site/Linking-DDMesh-to-Neon-7f71b42e375946ab80b1d8e5c86bfe9b"
                                  }
                                >
                                  the wiki for setup steps
                                </a>
                                .
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your fee</FormLabel>
                              <FormControl>
                                <Input type={"number"} {...field} />
                              </FormControl>
                              <FormDescription>
                                How much MESH charged per second your database
                                is alive
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="max_databases"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max databases</FormLabel>
                              <FormControl>
                                <Input type={"number"} {...field} />
                              </FormControl>
                              <FormDescription>
                                This should be 1 if your account is free tier.
                                If you have a paid account, you can set this to
                                whatever you're comfortable paying for.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <RenderMESHInWeek
                          perMinuteFee={parseFloat(form.watch("fee"))}
                        />
                        <RenderMESHInMonth
                          perMinuteFee={parseFloat(form.watch("fee"))}
                        />
                        <RenderNeonVerification
                          status={neonVerificationStatus}
                          error={neonVerificationError}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </Form>
                    <Button
                      onClick={() => wipeAllNeonDatabases(form.watch("apiKey"))}
                      disabled={form.watch("apiKey") === ""}
                    >
                      Start Fresh
                    </Button>
                  </CardContent>
                );
              } else if (step === 3) {
                return (
                  <CardContent className={"flex flex-col space-y-2"}>
                    <p>Thank you for registering!</p>
                    {/*TODO Put logo here*/}
                    <p>
                      We've transferred 100 MESH to your account to help you get
                      started
                    </p>
                    <p>Happy hacking!</p>
                  </CardContent>
                );
              }
              return <div>Well that wasn't supposed to happen</div>;
            })()}
          </Card>
        </div>
      </div>
    </>
  );
};
