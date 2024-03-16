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

const customersData: Customer[] = [
    {
        id: "derv1ws0",
        topUp: "5.3",
        eligibleClaim: "0.1",
    },
    {
        id: "5kma53ae",
        topUp: "5.3",
        eligibleClaim: "0.1",
    },
    {
        id: "bhqecj4p",
        topUp: "5.3",
        eligibleClaim: "0.1",
    },
]

export type Customer = {
    id: string
    topUp: string
    eligibleClaim: string
}

const CenterAlignedHeader: FC<{ header: string }> = ({header}) => (
    <div className="capitalize text-center">{header}</div>
)

const Customers = () => {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const onClaim = async () => {
    };

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "topUp",
            header: () => {
                return <CenterAlignedHeader header="Top Up"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("topUp")}</div>
            ),
        },
        {
            accessorKey: "eligibleClaim",
            header: () => {
                return <CenterAlignedHeader header="Eligible Claim"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("eligibleClaim")}</div>
            ),
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
        data: customersData || [] ,
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
                Customers
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
            accessorKey: "description",
            header: () => {
                return <CenterAlignedHeader header="Name"/>
            },
            cell: ({row}: any) => (
                <div className="capitalize">{row.getValue("description")}</div>
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
            <Customers/>
        </>
    );
};