import {Card} from "@/components/ui/card.tsx";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

export const DbProviderOnboarding = () => {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
                    <Jazzicon diameter={60} seed={jsNumberForAddress('0x1111111111111111111111111111111111111111')}/>
                    <div className={"flex-col"}>
                        <p className={"text-xl flex"}><img className={"h-5"} src={UsdcLogo}/><p>0.001/min</p></p>
                    </div>
                    <div className={"flex-col align-middle justify-center"}>
                        <img style={{height: 25}} src={PostgresLogo}/>
                    </div>
                    <p className={"text-xl"}>$name</p>
                    <div className={"flex-col"}>
                        <p className={"text-xl"}>$description</p>
                    </div>
                    <div className={"flex-col"}>
                        <p className={"text-xl"}>$tvl</p>
                    </div>
                    <div>
                        <Button onClick={() => navigate(`/deployDbProvider`)}>Deploy</Button>
                    </div>
                </Card>

                <Card className={"p-4 flex items-center leading-4 gap-x-2"}>
                    <Jazzicon diameter={60} seed={jsNumberForAddress('0x1111111111111111111111111111111111111111')}/>
                    <div className={"flex-col"}>
                        <p className={"text-xl flex"}><img className={"h-5"} src={UsdcLogo}/><p>0.001/min</p></p>
                    </div>
                    <div className={"flex-col align-middle justify-center"}>
                        <img style={{height: 25}} src={PostgresLogo}/>
                    </div>
                    <p className={"text-xl"}>$name</p>
                    <div className={"flex-col"}>
                        <p className={"text-xl"}>$description</p>
                    </div>
                    <div className={"flex-col"}>
                        <p className={"text-xl"}>$tvl</p>
                    </div>
                    <div>
                        <Button onClick={() => navigate(`/deployDbProvider`)}>Deploy</Button>
                    </div>
                </Card>
            </div>
        </>
    )
}