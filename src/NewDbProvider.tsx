import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import SupabaseLogo from "@/assets/supabase.svg";
import AwsLogo from "@/assets/aws.svg";
import DatabaseLogo from "@/assets/database.svg";
import {IconButton} from "@/common.tsx";
import {useState} from "react";
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

const formSchema = z.object({
	provider: z.string().min(1),
	ens: z.string().min(1),
	apiKey: z.string().min(1),
	// fee: z.number().positive(), //TODO This is broken
	fee: z.string(), //TODO This is broken
})
export const NewDbProvider = () => {
	const [step, setStep] = useState(1)
	// const [dbHost, setDbHost] = useState("supabase")
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema)
	})
	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log(data);
		setStep(3)
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
								<IconButton icon={SupabaseLogo} text={"Supabase"}
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
															<Input placeholder="very cool db provider" {...field} />
														</FormControl>
														<FormDescription>
															This is a friendly name that will be shown to othres
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
															<Input placeholder="idk.eth" {...field} />
														</FormControl>
														<FormDescription>
															I dunno, this is something
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
														<FormLabel>Supabase API Key</FormLabel>
														<FormControl>
															<Input placeholder="Supabase API Key" {...field} />
														</FormControl>
														<FormDescription>
															Your supabase API key, see wiki for setup steps
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
															<Input type={"number"} {...field} />
														</FormControl>
														<FormDescription>
															How much MESH charged per minute
														</FormDescription>
														<FormMessage/>
													</FormItem>
												)}
											/>
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
	</>)
}