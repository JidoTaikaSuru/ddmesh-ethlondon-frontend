import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import DDMeshLogo from "./assets/ddmesh-logo.svg";


export default function Home() {
	const navigate = useNavigate();

	return (
		<div className={"w-full h-96 border-2 flex items-center"}>
			<div style={{width: "50%"}} className={"ml-4"}>
			<p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl">
				Decentralized Database marketplace
			</p>
			<blockquote className="mt-6 mb-4  pl-6 italic">
				"Like Filecoin but for structured databases"
			</blockquote>
			<div className={"flex flex-col space-y-2"}>
				<Button onClick={() => navigate(`/getDbProvider`)}>Get a DB</Button>
				<Button variant="secondary" onClick={() => navigate(`/newDbProvider`)}>Become a Provider</Button>
			</div>
			</div>
			<div className={"flex items-center"}>
				<img src={DDMeshLogo} className={"h-32"}/>
				<p className="pb-2 text-3xl font-semibold">
					ddMesh
				</p>
			</div>
		</div>
	);
}