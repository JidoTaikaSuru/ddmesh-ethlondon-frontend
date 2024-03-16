import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import AwsLogo from "@/assets/aws.svg";
import NeonLogo from "@/assets/neon.ico";
import DatabaseLogo from "@/assets/database.svg";
import {IconButton, RenderMESHInMonth, RenderMESHInWeek} from "@/common.tsx";
import {FC, useState} from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {NeonClient} from "@/NeonClient.tsx";

const formSchema = z.object({
    provider: z.string().min(1),
    ens: z.string().min(1),
    apiKey: z.string().min(1),
    // fee: z.number().positive(), //TODO This is broken
    fee: z.string().default("0"),
    max_databases: z.string().default("1") //TODO Make this into a number later
})


const RenderNeonVerification: FC<{ status: string, error: string }> = ({status, error}) => {
    if (status === "error") {
        // TODO Fix the color here, use the tailwind color
        return <p style={{
            "color": "red"
        }}>{error}</p>
    }
    if (status === "pending") {
        return <p>Verifying neon credentials...</p>
    }
    if (status === "warn_on_multiple_dbs") {
        return <p style={{
            "color": "orange"
        }}>You already have the max amount of databases set up for your account tier</p>
    }
    if (status === "complete") {
        // TODO Fix the color here, use the tailwind color
        return <p style={{color: "green"}}>Verified!</p>
    }
    return <p></p>
}
export const DbProviderOnboarding = () => {
    const [step, setStep] = useState(1)
    const [neonVerificationStatus, setNeonVerificationStatus] = useState("not_started")
    const [neonVerificationError, setNeonVerificationError] = useState("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "",
            ens: "",
            apiKey: "",
            fee: "0",
            max_databases: "1"
        }
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        console.log("Doing basic checks against Neon...")
        const neonClient = new NeonClient(data.apiKey)
        setNeonVerificationStatus("pending")
        try {
            //Check if user has set up a project
            const projectId = await neonClient.getFirstProjectId()
            console.log("Found project id:", projectId)
            //Check if user has set up a branch
            const branchId = await neonClient.getFirstBranchId(projectId)
            console.log("Found branch id:", branchId)
            //Check if user has set up a database
            const databaseCount = await neonClient.getCurrentNumberOfDeployedDBs(projectId, branchId)
            console.log(`User has`, databaseCount, "databases set up out of an allowed", data.max_databases, "databases.")

            if (databaseCount >= parseInt(data.max_databases)) {
                setNeonVerificationStatus("error")
                setNeonVerificationError(`You have the max amount of databases set up for your account tier (${databaseCount}/${data.max_databases}), please delete one before continuing`)
                return
            }
            setNeonVerificationError("")
            setNeonVerificationStatus("complete")
            setStep(3)
        } catch(e: any) {
            console.error(e)
            setNeonVerificationStatus("error")
            setNeonVerificationError(e.message)
        }
    }

    return (<>
        <div className="flex justify-center">
            <div className="flex-col">
                {/*DATABASE PROVIDER CARD*/}
                <Card className="w-96">
                    <p onClick={() => {
                        if (step !== 1) {
                            setStep(step - 1)
                        }
                    }}>Back...</p>

                    <CardHeader>
                        <CardTitle>Pick a database host</CardTitle>
                        <CardDescription>Step {step}/3</CardDescription>
                    </CardHeader>
                    {(() => {
                        if (step === 1) {
                            return (<CardContent className="flex flex-col items-center space-y-2">
                                <IconButton icon={NeonLogo} text={"Neon"}
                                            buttonProps={{
                                                onClick: () => setStep(2)
                                            }}/>
                                <IconButton icon={AwsLogo} text={"AWS"} buttonProps={{disabled: true}}/>
                                <IconButton icon={DatabaseLogo} text={"Bare Metal"} buttonProps={{disabled: true}}/>
                            </CardContent>)
                        } else if (step === 2) {
                            return (
                                <CardContent className={"flex flex-col space-y-2"}>
                                    <Form {...form}>
                                        {/*TODO get decorator for feeToken here*/}
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                            <FormField
                                                control={form.control}
                                                name="provider"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Your provider name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Your provider name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            This is a friendly name that will be shown to others
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="ens"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>ENS</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ENS (optional)" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            ENS record that resolves to your internal provider id
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="apiKey"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Neon API Key</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Neon API Key" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your Neon API key, see <a
                                                            href={"https://summer-salute-f85.notion.site/Linking-DDMesh-to-Neon-7f71b42e375946ab80b1d8e5c86bfe9b"}>the
                                                            wiki for setup steps</a>.
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="fee"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Your fee</FormLabel>
                                                        <FormControl>
                                                            <Input type={"number"} {...field}/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            How much MESH charged per second your database is alive
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="max_databases"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Max databases</FormLabel>
                                                        <FormControl>
                                                            <Input type={"number"} {...field}/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            This should be 1 if your account is free tier. If you have a
                                                            paid account, you can set this to whatever you're
                                                            comfortable paying for.
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <RenderMESHInWeek perMinuteFee={parseFloat(form.watch("fee"))}/>
                                            <RenderMESHInMonth perMinuteFee={parseFloat(form.watch("fee"))}/>
                                            <RenderNeonVerification status={neonVerificationStatus}
                                                                    error={neonVerificationError}/>
                                            <Button type="submit">Submit</Button>
                                        </form>
                                    </Form>
                                </CardContent>)
                        } else if (step === 3) {
                            return (<CardContent className={"flex flex-col space-y-2"}>
                                <p>Thank you for registering!</p>
                                <p>We've transferred 100 MESH to your account to help you get started</p>
                                <p>Happy hacking!</p>
                            </CardContent>)
                        }
                        return <div>Well that wasn't supposed to happen</div>
                    })()}
                </Card>
                <Card className="w-96">
                    <CardTitle>Get started with Supabase</CardTitle>
                </Card>
                <Card className="w-96">

                </Card>
                {/*<div className={"w-96 border-2"}><Button>Previous</Button><Button>Next</Button></div>*/}
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle>What do you need?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder={"Space"} type={"number"}/>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Database"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="postgres">Postgres</SelectItem>
                                <SelectItem value="sqlite">SQLite</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                    <CardFooter>
                        <Button>Search</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

        <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
            <Checkbox style={{height: 30, width: 30}}/>
            <Jazzicon diameter={60} seed={jsNumberForAddress('0x1111111111111111111111111111111111111111')}/>
            <p className={"text-xl"}>Data Provider 1</p>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Rank</p>
                <p className={"text-xl"}>#1</p>
            </div>
            <div className={"flex-col align-middle justify-center"}>
                <p className={"text-sm"}>Database</p>
                <img style={{height: 25}} src={PostgresLogo}/>
            </div>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Storage Available</p>
                <p className={"text-xl"}>100GB</p>
            </div>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Storage Price</p>
                <p className={"text-xl flex"}><img className={"h-5"} src={UsdcLogo}/><p>0.001/min</p></p>
            </div>
        </Card>

        <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
            <Checkbox style={{height: 30, width: 30}}/>
            <Jazzicon diameter={60} seed={jsNumberForAddress('0x1111111111111111111111111111111111111111')}/>
            <p className={"text-xl"}>Data Provider 1</p>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Rank</p>
                <p className={"text-xl"}>#1</p>
            </div>
            <div className={"flex-col align-middle justify-center"}>
                <p className={"text-sm"}>Database</p>
                <img style={{height: 25}} src={PostgresLogo}/>
            </div>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Storage Available</p>
                <p className={"text-xl"}>100GB</p>
            </div>
            <div className={"flex-col"}>
                <p className={"text-sm"}>Storage Price</p>
                <p className={"text-xl flex"}><img className={"h-5"} src={UsdcLogo}/><p>0.001/min</p></p>
            </div>
        </Card>
    </>)
}