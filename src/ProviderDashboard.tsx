import {FC} from "react";
import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    VisibilityState
} from "@tanstack/table-core";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {Provider} from "@/DbProviderOnboarding";
import {useChainId, useReadContract} from "wagmi";
import {abi as ddmeshMarketAbi} from "../contracts/DDMeshMarket.sol/DDMeshMarket.json";
import {getContracts} from "@/config/contracts.config";
import ddMeshLogo from "@/assets/ddmesh-logo-fixed.svg";
import {hardcodedDDMToUsdFee} from "@/common";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const agreements: Agreement[] = [
    {
        id: 4,
        user: "User10",
        userBalance: 5.3,
        providerId: 3,
        startTimeStamp: 3543,
        status: "ENTERED",
        providerAddress: "providerAddress",
        providerClaimed: "providerClaimed",
        encConnectionString: "fakeConnectionString1",
    },
    {
        id: 23,
        user: "User10",
        userBalance: 5.3,
        providerId: 3,
        startTimeStamp: 3543,
        status: "ENTERED",
        providerAddress: "providerAddress",
        providerClaimed: "providerClaimed",
        encConnectionString: "fakeConnectionString1",
    },
    {
        id: 10,
        user: "User10",
        userBalance: 5.3,
        providerId: 3,
        startTimeStamp: 3543,
        status: "ENTERED",
        providerAddress: "providerAddress",
        providerClaimed: "providerClaimed",
        encConnectionString: "fakeConnectionString1",
    },
]

export type Agreement = {
    id: bigint
    user: string
    userBalance: bigint
    providerId: bigint
    startTimeStamp: bigint
    status: string
    providerAddress: string
    providerClaimed: string
    encConnectionString: string
}

const CenterAlignedHeader: FC<{ header: string }> = ({header}) => (
    <div className="capitalize text-center">{header}</div>
)

const Agreements = () => {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const onClaim = async () => {
    };

    const onWithdraw = async () => {
    };

    const columns: ColumnDef<Agreement>[] = [
        {
            accessorKey: "user",
            header: () => {
                return <CenterAlignedHeader header="User"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("user")}</div>
            ),
        },
        {
            accessorKey: "userBalance",
            header: () => {
                return <CenterAlignedHeader header="User balance"/>
            },
            cell: ({row}: any) => (
                <div className={"justify-center flex items-center space-x-1"}>
                    <img className={"h-5"} src={ddMeshLogo} />
                    <p className={"text-lg"}>{row.getValue("userBalance")}</p>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => {
                return <CenterAlignedHeader header="Status"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("status")}</div>
            ),
        },
        {
            accessorKey: "button",
            header: () => {
                return <CenterAlignedHeader header=""/>
            },
            cell: () => (
                <div>
                    <Button onClick={() => onWithdraw()}>Withdraw</Button>
                </div>
            )
        },
        {
            accessorKey: "button",
            header: () => {
                return <CenterAlignedHeader header=""/>
            },
            cell: () => (
                <div>
                    <Button onClick={() => onClaim()}>Claim</Button>
                </div>
            )
        }
    ]

    const table = useReactTable({
        data: agreements || [] ,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return(
        <div className={"text-center"}>
            <br/>
            <h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Agreements
            </h3>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="[&:has([role=checkbox])]:pl-3"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="[&:has([role=checkbox])]:pl-3"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No customers.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export const ProviderDashboard = () => {

    const chainId = useChainId();

    const ddmeshMarketAddress = getContracts(chainId)
        .ddmeshMarket as `0x${string}`;
    console.log("ddmeshMarketAddress", ddmeshMarketAddress);

    const onDelete = async () => {
    };

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns: ColumnDef<Provider>[] = [
        {
            accessorKey: "fee",
            header: () => {
                return <CenterAlignedHeader header="Fee"/>
            },
            cell: ({row}: any) => (
                <div className={"flex-col items-middle"}>
                    <p className={"text-lg flex"}>{hardcodedDDMToUsdFee()}</p>
                    <div className={"flex items-center space-x-1"}>
                        <img className={"h-5"} src={ddMeshLogo} />
                        <p className={"text-lg flex"}>{row.getValue("fee")} DMM/mo</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: () => {
                return <CenterAlignedHeader header="Description"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("description")}</div>
            ),
        },
        {
            accessorKey: "ensName",
            header: () => {
                return <CenterAlignedHeader header="ens Name"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("ensName")}</div>
            ),
        },
        {
            accessorKey: "noOfDbAgreements",
            header: () => {
                return <CenterAlignedHeader header="Number of Agreements"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("noOfDbAgreements")}</div>
            ),
        },
        {
            accessorKey: "activeAgreements",
            header: () => {
                return <CenterAlignedHeader header="Active Agreements"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("activeAgreements")}</div>
            ),
        },
        {
            accessorKey: "encApiKey",
            header: () => {
                return <CenterAlignedHeader header=""/>
            },
            cell: ({row}: any) => (
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button onClick={() => onDelete()} variant="secondary">Show API Key</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max">
                            <DialogHeader>
                                <DialogTitle>API Key</DialogTitle>
                                <DialogDescription>
                                    {row.getValue("encApiKey")}
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
        {
            accessorKey: "button",
            header: () => {
                return <CenterAlignedHeader header=""/>
            },
            cell: () => (
                <div>
                    <Button onClick={() => onDelete()}>Delete</Button>
                </div>
            )
        }
    ]

    const {data: providers} = useReadContract({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "getAllProviders",
        args: [],
    });

    const table = useReactTable({
        data: providers as Provider[] || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <>
            <div className={"text-center"}>
                <h1>Provider Dashboard</h1>
                <h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Products catalog
                </h3>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="[&:has([role=checkbox])]:pl-3"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="[&:has([role=checkbox])]:pl-3"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Agreements/>
        </>
    );
};