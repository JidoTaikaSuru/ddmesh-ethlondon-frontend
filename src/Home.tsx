import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import DDMeshLogo from "./assets/ddmesh-logo-fixed.svg";
import {useAccount} from "wagmi";

export default function Home() {
    const navigate = useNavigate();
    const account = useAccount();
    const notConnected = !account.isConnected
    return (
        <div className={"w-full h-96 border-2 flex items-center"}>
            <div style={{width: "50%"}} className={"ml-4"}>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl">
                    Decentralized Database marketplace
                </p>
                <blockquote className="mt-6 mb-4  pl-6 italic">
                    "Like Filecoin but for structured databases"
                </blockquote>
                {
                    <div className={"flex flex-col space-y-2 items-center"}>
                        <Button disabled={notConnected} className={"w-48"} onClick={() => navigate(`/getDbProvider`)}>Get
                            a DB</Button>
                        <Button disabled={notConnected} className={"w-48"}
                                onClick={() => navigate(`/getUserAgreements`)}>
                            User Agreements
                        </Button>
                        <Button disabled={notConnected} className={"w-48"} variant="secondary"
                                onClick={() => navigate(`/newDbProvider`)}>Become a Provider</Button>
                        {notConnected && <div className="text-red-500">Connect your wallet to continue</div>}
                    </div>
                }
            </div>
            <div className={"flex w-full items-center justify-center align-middle space-x-4"}>
                <img src={DDMeshLogo} className={"h-32"}/>
                <p className="pb-2 text-3xl font-semibold text-primary">
                    ddMesh
                </p>
            </div>
        </div>
    );
}
