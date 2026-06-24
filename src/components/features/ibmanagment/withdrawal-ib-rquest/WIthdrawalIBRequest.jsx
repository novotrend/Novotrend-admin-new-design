"use client";

import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";

import {
  useIBWithdrawalAction,
  useIBWithdrawalRequestList,
} from "@/services/ib-managment/ib-managment.query";
import WithdrawalAcceptedKycModal from "./AcceptedKycModal";

export default function WithdrawalIBRequest() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useIBWithdrawalRequestList({
    limit,
    offset,
    search: debouncedSearch,
  });

  const { mutate: withdrawalActionRemark, isPending } = useIBWithdrawalAction();
  const rows = data?.data?.response?.records || [];
  const total = data?.data?.response?.total_records || 0;

  const handleOpenModal = (item, status) => {
    setSelectedRequest(item);
    setActionStatus(status);
    setOpen(true);
  };

  const handleSubmit = remark => {
    mutate(
      {
        status: actionStatus,
        recordid: selectedRequest?.recordid,
        remark,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedRequest(null);
          setActionStatus(null);
        },
      }
    );
  };

  const tableHeaders = [
    {
      label: "S.No",
      key: "id",
      sortable: false,
    },
    {
      label: "Name",
      key: "name",
      sortable: true,
    },
    {
      label: "Email",
      key: "email",
      sortable: true,
    },
    {
      label: "Date",
      key: "date",
      sortable: true,
    },
    {
      label: "Amount",
      key: "amount",
      sortable: true,
    },
    {
      label: "Admin",
      key: "admin",
      sortable: true,
    },
    {
      label: "Remark",
      key: "remark",
      sortable: true,
    },
    {
      label: "Action",
      key: "action",
      sortable: false,
    },
  ];

  return (
    <>
      <TableWrapper
        title="Withdrawal IB Request"
        description="Manage all IB withdrawal requests"
        actions={
          <>
            <TableSearch value={search} onChange={setSearch} />

            <ExportDropdown />
          </>
        }
        footer={
          <TableFooter
            limit={limit}
            setLimit={setLimit}
            offset={offset}
            setOffset={setOffset}
            total={total}
          />
        }
      >
        <DataTable headers={tableHeaders}>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : rows.length > 0 ? (
            rows.map((item, index) => (
              <TableRow
                key={item.recordid || index}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                  {offset + index + 1}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                      <p className="text-xs text-muted-foreground">IB Withdrawal User</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item?.email || "-"}
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item?.date || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    {item?.amount || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                  {item?.admin || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-600">
                    <TruncatedCell
                      text={item?.remark}
                      maxLength={30}
                      className="!text-yellow-600"
                    />
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenModal(item, 1)}
                      className="rounded-xl bg-green-500/10 p-2 transition-all hover:bg-green-500/20"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </button>

                    <button
                      onClick={() => handleOpenModal(item, 2)}
                      className="rounded-xl bg-red-500/10 p-2 transition-all hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center">
                No withdrawal requests found
              </TableCell>
            </TableRow>
          )}
        </DataTable>
      </TableWrapper>

      <WithdrawalAcceptedKycModal
        open={open}
        onOpenChange={setOpen}
        actionType={actionStatus}
        isLoading={isPending}
        onSubmit={remark => {
          withdrawalActionRemark(
            {
              status: actionStatus,
              recordid: selectedRequest?.id,
              remark,
            },
            {
              onSuccess: response => {
                setOpen(false);
              },

              onError: error => {},
            }
          );
        }}
      />
    </>
  );
}
