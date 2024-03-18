import { Button } from "@/components/ui/button";
import * as React from "react";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { getContracts } from "./config/contracts.config";
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
import { Agreement, CenterAlignedHeader, Provider } from "@/common.tsx";
import { flexRender, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import DDMeshLogo from "./assets/ddmesh-logo-fixed.svg";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { abi as ddmeshMarketAbi } from "../contracts/DDMeshMarket.sol/DDMeshMarket.json";
import { formatEther } from "viem";
import { QueryDialog } from "./QueryDialog";

export const UserAgreements = () => {
  // const [providerChoice, _] = useState<bigint>(BigInt(0));
  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  // const tokenAddress = getContracts(chainId).token as `0x${string}`;
  const ddmeshMarketAddress = getContracts(chainId)
      .ddmeshMarket as `0x${string}`;
  console.log("ddmeshMarketAddress", ddmeshMarketAddress);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
  );
  const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // TODO Get provider names from contract

  const { data: userAgreements } = useReadContract({
    address: ddmeshMarketAddress,
    abi: ddmeshMarketAbi,
    functionName: "getUserAgreements",
    args: [userAddress],
  });

  const { data: providersArr } = useReadContract({
    address: ddmeshMarketAddress,
    abi: ddmeshMarketAbi,
    functionName: "getAllProviders",
    args: [],
  });
  const providersObj: { [key: string]: Provider } = (
      providersArr as Provider[]
  )?.reduce<{ [key: string]: Provider }>((acc, provider) => {
    acc[provider.id.toString()] = provider;
    return acc;
  }, {});
  console.log("providersObj", providersObj);

  const calculateRemainingDays = (row: any) => {
    const userBalance = calculateRemainingBalance(row);
    const dailyFee =
        parseFloat(formatEther(providersObj[row.original?.id?.toString()]?.fee)) *
        60 *
        60 *
        24;
    return Number((userBalance / dailyFee).toFixed(2));
  };

  const calculateRemainingBalance = (row: any) => {
    const userBalance = Number(formatEther(row.original?.userBalance));
    const usedBalance =
        Number(formatEther(providersObj[row.original?.id?.toString()]?.fee)) *
        (Math.floor(new Date().getTime() / 1000) -
            Number(row.original.startTimeStamp));
    return Number((userBalance - usedBalance).toFixed(2));
  };

  const columns: ColumnDef<Agreement>[] = [
    {
      accessorKey: "providerId",
      header: () => {
        return <CenterAlignedHeader header="ID" />;
      },
      cell: ({ row }: any) => (
          <div className={"flex items-center justify-center"}>
            <p>{row.original?.providerId?.toString()}</p>
          </div>
      ),
    },
    {
      accessorKey: "Name",
      header: () => {
        return <CenterAlignedHeader header="Name" />;
      },
      cell: ({ row }: any) => {
        console.log("row.original", row.original);
        console.log("row.original?.id", row.original?.id);
        console.log(
            "providersObj[row.original?.id]",
            providersObj[row.original?.id?.toString()]
        );
        return (
            <div className="text-center">
              {providersObj[row.original?.id?.toString()]?.description}
            </div>
        );
      },
    },
    {
      accessorKey: "userBalance",
      header: () => {
        return <CenterAlignedHeader header="Remaining Balance DDM" />;
      },
      cell: ({ row }: any) => (
          <div className={"flex justify-center items-center space-x-2"}>
            <img src={DDMeshLogo} style={{ height: 20 }} />

            <p>{calculateRemainingBalance(row)} DDM</p>
          </div>
      ),
    },
    {
      accessorKey: "remainingDays",
      header: () => {
        return <CenterAlignedHeader header="Remaining Days" />;
      },
      cell: ({ row }: any) => (
          <div className={"flex justify-center items-center space-x-2"}>
            <img src={DDMeshLogo} style={{ height: 20 }} />

            <p>{calculateRemainingDays(row)} Days</p>
          </div>
      ),
    },
    {
      accessorKey: "startTimestamp",
      header: () => {
        return <CenterAlignedHeader header="Start Time" />;
      },
      cell: ({ row }: any) => (
          <div className="text-center">
            {new Date(
                parseInt(row.original?.startTimeStamp.toString()) * 1000
            ).toLocaleString()}
          </div>
      ),
    },
    {
      accessorKey: "Actions",
      header: () => {
        return <CenterAlignedHeader header="Actions" />;
      },
      // @ts-ignore
      cell: ({ row }: any) => {
        console.log("row", row.original);
        return (
            <div className={"flex w-24 space-x-2"}>
              <Button onClick={() => console.log("TOP UP CLICKED")}>
                Top Up
              </Button>
              {/*<QueryDialog connectionString={row.original?.encConnectionString}/>*/}
              <QueryDialog connectionString={"postgresql://ddtest_owner:gwMW5CZOQI3G@ddmesh.eth/ddtest?sslmode=require"}/>
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
        <h1 className={"text-3xl mb-4"}>My Agreements</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                          <TableHead
                              key={header.id}
                              className="px-2 w-1/6 [&:has([role=checkbox])]:pl-3"
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
                                className="px-2 w-1/6 [&:has([role=checkbox])]:pl-3"
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </>
  );
};
