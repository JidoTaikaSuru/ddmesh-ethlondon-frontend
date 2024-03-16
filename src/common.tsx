import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {FC} from "react";

const ONE_WEEK = 60 * 24 * 7;
const ONE_MONTH = 60 * 24 * 30;
export const IconButton: React.FC<{ icon: string, text: string, buttonProps: ButtonProps }> = ({icon, text, buttonProps}) => {
    return (<Button className="flex items-center w-48 gap-2" {...buttonProps}>
        <div className="bg-black rounded-full flex justify-center items-center w-6 h-6">
            <img src={icon} alt={text} className="w-4 h-4"/>
        </div>
        <span className="flex-grow text-left">{text}</span>
    </Button>)
}

export const RenderMESHInWeek: FC<{perMinuteFee: number}> = ({perMinuteFee}) => {
    return <div>
        <div>Per week</div>
        <div>{(perMinuteFee * ONE_WEEK).toFixed(2)} MESH</div>
    </div>
}

export const RenderMESHInMonth: FC<{perMinuteFee: number}> = ({perMinuteFee}) => {
    return <div className={"flex-col text-center"}>
        <div>Per month</div>
        <div>{(perMinuteFee * ONE_MONTH).toFixed(2)} MESH</div>
    </div>
}

export const hardcodedDDMToUsdFee = () => 50