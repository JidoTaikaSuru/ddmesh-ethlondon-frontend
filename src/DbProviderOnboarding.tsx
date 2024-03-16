import {Card} from "@/components/ui/card.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
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
                    <div>
                        <Button onClick={() => navigate(`/newDbProvider`)}>Deploy</Button>
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
                    <div>
                        <Button onClick={() => navigate(`/newDbProvider`)}>Deploy</Button>
                    </div>
                </Card>
            </div>
        </>
    )
}