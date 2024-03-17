import {Button} from "@/components/ui/button";
import * as React from "react";
import {useAccount, useChainId, useClient, useReadContract} from "wagmi";
import {getContracts} from "./config/contracts.config";
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
} from "@tanstack/table-core";
import {Agreement, CenterAlignedHeader, Provider} from "@/common.tsx";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table.tsx";
import DDMeshLogo from "./assets/ddmesh-logo-fixed.svg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {abi as ddmeshMarketAbi} from "../contracts/DDMeshMarket.sol/DDMeshMarket.json";
import {useEffect} from "react";


export const UserAgreements = () => {
    // const [providerChoice, _] = useState<bigint>(BigInt(0));

    const client = useClient();
    const chainId = useChainId();
    const {address: userAddress,} = useAccount();
    // const tokenAddress = getContracts(chainId).token as `0x${string}`;
    const ddmeshMarketAddress = getContracts(chainId)
        .ddmeshMarket as `0x${string}`;
    console.log("ddmeshMarketAddress", ddmeshMarketAddress);


    // const onDeploy = async () => {
    //     writeContractApprove({
    //         address: tokenAddress,
    //         abi: tokenAbi,
    //         functionName: "approve",
    //         args: [ddmeshMarketAddress, BigInt(1)],
    //     });
    // };

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // TODO Get provider names from contract

    const {data: userAgreements} = useReadContract({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "getUserAgreements",
        args: [userAddress],
    });

    // const {contract} = useReadContract({
    //     address: ddmeshMarketAddress,
    //     abi: ddmeshMarketAbi,
    // });
    // useEffect(() => {
    //     // fetch balance for each agreement
    //     const fetchBalances = async () => {
    //         if (userAgreements) {
    //             client.
    //             for (let i = 0; i < userAgreements.length; i++) {
    //                 const agreement = userAgreements[i];
    //
    //                 const {data: balance} = await useReadContract({
    //                     address: ddmeshMarketAddress,
    //                     abi: ddmeshMarketAbi,
    //                     functionName: "getBalance",
    //                     args: [agreement.id],
    //                 });
    //                 userAgreements[i].userBalance = balance;
    //             }
    //         }
    //     };
    // }, [userAgreements])

    //
    // const {data: agreementsArr} = useReadContract({
    //     address: ddmeshMarketAddress,
    //     abi: ddmeshMarketAbi,
    //     functionName: "getAllAgreements",
    //     args: [],
    // });
    // const agreements = (agreementsArr as Agreement[]).filter((agreement: Agreement) => agreement.user === userAddress);


    const {data: providersArr} = useReadContract({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "getAllProviders",
        args: [],
    });
    const providersObj: {[key: string]: Provider} = (providersArr as Provider[])?.reduce<{ [key: string]: Provider; }>((acc, provider) => {
        acc[provider.id.toString()] = provider;
        return acc;
    }, {});
    console.log("providersObj", providersObj);



    const columns: ColumnDef<Agreement>[] = [
        {
            accessorKey: "providerId",
            header: () => {
                return <CenterAlignedHeader header="ID"/>;
            },
            cell: ({row}: any) => (
                <div className={"flex items-center justify-center"}>
                    <p>{row.original?.providerId?.toString()}</p>
                </div>
            ),
        },
        {
            accessorKey: "Name",
            header: () => {
                return <CenterAlignedHeader header="Name"/>;
            },
            cell: ({row}: any) => {
                console.log("row.original", row.original);
                console.log("row.original?.id", row.original?.id);
                console.log("providersObj[row.original?.id]", providersObj[row.original?.id?.toString()]);
                return (<div className="text-center">{providersObj[row.original?.id?.toString()]?.description}</div>)
            }
        },
        {
            accessorKey: "userBalance",
            header: () => {
                return <CenterAlignedHeader header="Balance"/>;
            },
            cell: ({row}: any) => (
                <div className={"flex justify-center items-center space-x-2"}>
                    <img src={DDMeshLogo} style={{height: 20}}/>
                    <p>1,000 DDM</p>
                </div>
            ),
        },
        {
            accessorKey: "startTimestamp",
            header: () => {
                return <CenterAlignedHeader header="Start Time"/>;
            },
            cell: ({row}: any) => (
                <div className="text-center">{new Date(parseInt(row.original?.startTimeStamp.toString()) * 1000).toLocaleString()}</div>
            ),
        },
        {
            accessorKey: "Actions",
            header: () => {
                return <CenterAlignedHeader header="Actions"/>;
            },
            cell: ({row}: any) => {
                return (
                    <div className={"flex w-24 space-x-2"}>
                        <Button onClick={() => console.log("TOP UP CLICKED")}>
                            Top Up
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary">Conn. String</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max">
                                <DialogHeader>
                                    <DialogTitle>API Key</DialogTitle>
                                    <DialogDescription>
                                        {row.original?.encConnectionString}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant={"secondary"}
                            onClick={() => console.log("TERMINATE CLICKED")}
                        >
                            Terminate
                        </Button>
                    </div>
                );
            },
        },
    ];


    const table = useReactTable({
        data: (userAgreements as Agreement[]) || [],
        //@ts-ignore
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
    });
    return (
        <>
            <h1 className={"text-3xl"}>My Agreements</h1>
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
                                    );
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
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#"/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#"/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
};
