import PostgresLogo from "@/assets/postgres.svg";
import UsdcLogo from "@/assets/usdc.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {FC, useCallback, useEffect} from "react";
import { useChainId, useWriteContract } from "wagmi";
import { getContracts } from "./config/contracts.config";

import { abi as tokenAbi } from "./../contracts/Token.sol/Token.json";
import { abi as ddmeshMarketAbi } from "./../contracts/DDMeshMarket.sol/DDMeshMarket.json";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data: Provider[] = [
  {
    id: "derv1ws0",
    storagePrice: "$50/mo",
    name: "One",
    description: "500gb 2vcore",
    tvl: "$10 TVL",
  },
  {
    id: "5kma53ae",
    storagePrice: "$5/mo",
    name: "Two",
    description: "0.5gb 0.2",
    tvl: "$50 TVL",
  },
  {
    id: "bhqecj4p",
    storagePrice: "$14/mo",
    name: "Three",
    description: "200gb serverless",
    tvl: "$136 TVL",
  },
]

export type Provider = {
  id: string
  storagePrice: string
  name: string
  description: string
  tvl: string
}

const ddmValue : number = 0.1;

const CenterAlignedHeader: FC<{header: string}> = ({ header }) => (
    <div className="capitalize text-center">{header}</div>
)
export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "storagePrice",
    header: () => {
      return <CenterAlignedHeader header="Storage Price" />
    },
    cell: ({ row }) => (
        <div className={"flex-col"}>
          <p className={"text-lg flex"}>
            <p>{row.getValue("storagePrice")}</p>
          </p>
          <p className={"text-lg flex"}>
            <p>{ddmValue} DMM/mo</p>
          </p>
        </div>
    ),
  },
  {
    accessorKey: "dataProvider",
    header: () => {
      return <CenterAlignedHeader header="Data Provider" />
    },
    cell: ({ row }) => (
        <div className={"flex items-middle justify-center"}>
          <img style={{ height: 50 }} src={PostgresLogo} />
        </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => {
      return <CenterAlignedHeader header="Name" />
    },
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => {
      return <CenterAlignedHeader header="Description" />
    },
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "tvl",
    header: () => {
      return <CenterAlignedHeader header="TVL" />
    },
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tvl")}</div>
    ),
  },
  {
    accessorKey: "button",
    header: () => {
      return <CenterAlignedHeader header="Deploy" />
    },
    cell: ({row}) => (
        <div>
          <Button onClick={() => onDeploy()}>Deploy</Button>
        </div>
    )
  }
]

export const DbProviderOnboarding = () => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const chainId = useChainId();
  const tokenAddress = getContracts(chainId).token as `0x${string}`;
  const ddmeshMarketAddress = getContracts(chainId)
    .ddmeshMarket as `0x${string}`;
  console.log("ddmeshMarketAddress", ddmeshMarketAddress);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
  )
  const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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

  const {
    data: hash,
    isPending: isPendingApprove,
    writeContract: writeContractApprove,
    isSuccess: isApproveSuccess,
  } = useWriteContract();

  const {
    // data: hashEnterAgreement,
    // isPending: isPendingEnterAgreement,
    writeContract: writeContractEnterAgreement,
    isSuccess: isEnterAgreementSuccess,
    isError: isEnterAgreementError,
  } = useWriteContract();

  const onDeploy = async () => {
    writeContractApprove({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "approve",
      args: [ddmeshMarketAddress, BigInt(1)],
    });
  };

  useEffect(() => {
    if (
      isApproveSuccess &&
      !isPendingApprove &&
      !isEnterAgreementError &&
      !isEnterAgreementSuccess
    ) {
      writeContractEnterAgreement({
        address: ddmeshMarketAddress,
        abi: ddmeshMarketAbi,
        functionName: "enterAgreement",
        args: [BigInt(1), "0x6ae181072abc10a4ee84724be867c71e0d4c0471"],
      });
    }
  }, [isApproveSuccess]);

  // as soon as isEnterAgreementSuccess is true, we show a success message to the user
  useEffect(() => {
    if (isEnterAgreementSuccess && !isEnterAgreementError) {
      console.log("Successfully entered agreement and paid");
      toast({
        title: "SuccessFully Paid For Agreement",
        description: "Friday, February 10, 2023 at 5:57 PM",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
        color: "success",
      });
    }
  }, [isEnterAgreementSuccess]);

  // get metamask provider from wagmi
  const provider = window.ethereum;

  useCallback(async () => {
    const res = await provider?.request({
      method: "eth_getEncryptionPublicKey",
      params: ["0x6ae181072aBc10a4eE84724BE867c71E0d4C0471"],
    });

    console.log("res", res);
  }, [provider]);

  return (
    <>
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
