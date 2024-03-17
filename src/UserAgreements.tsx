import { Button } from "@/components/ui/button";
import * as React from "react";
import { useEffect, useState } from "react";
import { useChainId, useWriteContract } from "wagmi";
import { getContracts } from "./config/contracts.config";
import { abi as ddmeshMarketAbi } from "../contracts/DDMeshMarket.sol/DDMeshMarket.json";
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
import { Agreement, AgreementStatus, CenterAlignedHeader } from "@/common.tsx";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

type Provider = {
  id: bigint;
  pAddress: string;
  fee: bigint; // DDM Tokens
  encApiKey: string;
  ensName: string;
  description: string;
  noOfDbAgreements: bigint;
  activeAgreements: bigint;
};

export const UserAgreements = () => {
  const [providerChoice, _] = useState<bigint>(BigInt(0));

  const chainId = useChainId();

  const tokenAddress = getContracts(chainId).token as `0x${string}`;
  const ddmeshMarketAddress = getContracts(chainId)
    .ddmeshMarket as `0x${string}`;
  console.log("ddmeshMarketAddress", ddmeshMarketAddress);

  const {
    isPending: isPendingApprove,
    writeContract: writeContractApprove,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  const {
    writeContract: writeContractEnterAgreement,
    isSuccess: isEnterAgreementSuccess,
    isError: isEnterAgreementError,
  } = useWriteContract();

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

  // const {data: providers} = useReadContract({
  //     address: ddmeshMarketAddress,
  //     abi: ddmeshMarketAbi,
  //     functionName: "getAllProviders",
  //     args: [],
  // });
  //
  //
  // Columns:
  //     id: BigInt(1),
  //         user: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  //     userBalance: BigInt(1000),
  //     providerId: BigInt(1),
  //     startTimeStamp: BigInt(Date.now()),
  //     status: AgreementStatus.ENTERED,
  //
  //
  //     Columns you don't show (just putting these here so you know not to show them):
  // providerAddress: '0x4E83362442B8d1beC281594CEA3050c8EB01311C',
  //     providerClaimed: BigInt(0),
  //     encConnectionString: 'fakeConnectionString1',
  const columns: ColumnDef<Provider>[] = [
    {
      accessorKey: "providerId",
      header: () => {
        return <CenterAlignedHeader header="Provider" />;
      },
      cell: ({ row }: any) => (
        <div className={"flex items-center justify-center"}>
          <p>{row.original?.providerId.toString()}</p>
        </div>
      ),
    },
    {
      accessorKey: "userBalance",
      header: () => {
        return <CenterAlignedHeader header="Balance" />;
      },
      cell: ({ row }: any) => (
        <div className={"flex justify-center items-center space-x-2"}>
          <img src={DDMeshLogo} style={{ height: 20 }} />
          <p>1,000 DDM</p>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: () => {
        return <CenterAlignedHeader header="Name" />;
      },
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "startTimestamp",
      header: () => {
        return <CenterAlignedHeader header="Start Time" />;
      },
      cell: ({ row }: any) => (
        <div className="text-center">TODO {row.getValue("startTimestamp")}</div>
      ),
    },

    {
      accessorKey: "Actions",
      header: () => {
        return <CenterAlignedHeader header="Actions" />;
      },
      cell: ({ row }: any) => {
        return (
          <div className={"flex w-24 space-x-2"}>
            <Button onClick={() => console.log("TOP UP CLICKED")}>
              Top Up
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => console.log(row.original?.encConnectionString)}
            >
              Conn. String
            </Button>
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

  //

  const agreements: Agreement[] = [
    {
      id: BigInt(1),
      user: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      userBalance: BigInt(1000),
      providerAddress: "0x4E83362442B8d1beC281594CEA3050c8EB01311C",
      providerId: BigInt(1),
      providerClaimed: BigInt(0),
      encConnectionString: "fakeConnectionString1",
      startTimeStamp: BigInt(Date.now()),
      status: AgreementStatus.ENTERED,
    },
    {
      id: BigInt(2),
      user: "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
      userBalance: BigInt(2000),
      providerAddress: "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      providerId: BigInt(2),
      providerClaimed: BigInt(500),
      encConnectionString: "fakeConnectionString2",
      startTimeStamp: BigInt(Date.now()),
      status: AgreementStatus.ACTIVE,
    },
    {
      id: BigInt(3),
      user: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
      userBalance: BigInt(3000),
      providerAddress: "0x583031D1113aD414F02576BD6afaBfb302140225",
      providerId: BigInt(3),
      providerClaimed: BigInt(1000),
      encConnectionString: "fakeConnectionString3",
      startTimeStamp: BigInt(Date.now()),
      status: AgreementStatus.CLOSED,
    },
  ];

  const table = useReactTable({
    data: (agreements as Agreement[]) || [],
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

        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
