import {Button, ButtonProps} from "@/components/ui/button.tsx";
import * as React from "react";
import {FC} from "react";

const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_MONTH = 60 * 60 * 24 * 30;
export const IconButton: React.FC<{ icon: string, text: string, buttonProps: ButtonProps }> = ({icon, text, buttonProps}) => {
    return (<Button className="flex items-center w-48 gap-2" {...buttonProps}>
        <div className="bg-black rounded-full flex justify-center items-center w-6 h-6">
            <img src={icon} alt={text} className="w-4 h-4"/>
        </div>
        <span className="flex-grow text-left">{text}</span>
    </Button>)
}

export const RenderMESHInWeek: FC<{perSecondFee: number}> = ({perSecondFee}) => {
    return <div>
        <div>Per week</div>
        <div>{(perSecondFee * ONE_WEEK).toFixed(2)} DDM</div>
    </div>
}

export const RenderMESHInMonth: FC<{perSecondFee: number}> = ({perSecondFee}) => {
    return <div className={"flex-col text-center"}>
        <div>Per month</div>
        <div>{(perSecondFee * ONE_MONTH).toFixed(2)} DDM</div>
    </div>
}

export const hardcodedDDMToUsdFee = () => 50

export const CenterAlignedHeader: FC<{ header: string }> = ({header}) => (
    <div className="capitalize text-center">{header}</div>
)
export type Agreement = {
    id: bigint; // or number, if within JS safe integer range
    user: string; // Address as a string
    userBalance: bigint; // or number
    providerAddress: string; // Address as a string
    providerId: bigint; // or number
    providerClaimed: bigint; // or number
    encConnectionString: string;
    startTimeStamp: bigint; // or number, timestamp as number is usually safe
    status: AgreementStatus;
};

export enum AgreementStatus {
    NONE,
    ENTERED,
    ACTIVE,
    CLOSED,
    REVOKED,
    ERROR,
}

export type Provider = {
    id: bigint;
    pAddress: string;
    fee: bigint; // DDM Tokens
    encApiKey: string;
    ensName: string;
    description: string;
    noOfDbAgreements: bigint;
    activeAgreements: bigint;
};
