import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export const DeployDbProvider = () => {

	return (
		<div>
			<h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				Deploy Db Provider
			</h3>

			<Card className="w-96">
				<CardHeader>
					<CardTitle>Top UP Credits for $dbDescription</CardTitle>
				</CardHeader>
				<CardContent>
					<Input placeholder={"Amount"} type={"number"} min="0"/>
				</CardContent>
				<CardFooter>
					<Button>Top up</Button>
				</CardFooter>
			</Card>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				You can withdraw unused tokens at any time.
				<br/>
				The DB Provider can at max withdraw once per day.
			</p>
		</div>
	)
}