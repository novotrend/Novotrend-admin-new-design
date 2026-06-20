"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import DataTable from "@/components/common/tables/DataTable";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";

import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import { useDeleteEmployeeMutation } from "@/services/employeemanage/employee.mutation";
import { useAdminStaffListQuery } from "@/services/employeemanage/employee.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Username", key: "username" },
  { label: "Password", key: "password" },
  { label: "Email", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Address", key: "address" },
  { label: "Joining Date", key: "joining_date" },
  { label: "Permission", key: "permission" },
  { label: "Action", key: "action" },
];

export default function ListEmployee() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useAdminStaffListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const employees = data?.response?.employee_list || [];

  // pagination calculations
  const total = Number(data?.response?.total_records) || employees.length;
  const currentPage = Math.floor(offset / limit) + 1;
  const deleteEmployeeMutation = useDeleteEmployeeMutation();
  const handleDeleteEmployee = staffId => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
    deleteEmployeeMutation.mutate({
      staff_id: staffId,
    });
  };

  return (
    <TableWrapper
      title="Employee List"
      description="Manage employee accounts and permissions"
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
        {/* LOADING STATE */}
        {isLoading && (
          <TableRow>
            <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
              Loading employees...
            </TableCell>
          </TableRow>
        )}

        {/* ERROR STATE */}
        {isError && (
          <TableRow>
            <TableCell colSpan={10} className="py-10 text-center text-red-500">
              Failed to load employee list
            </TableCell>
          </TableRow>
        )}

        {/* DATA STATE */}
        {!isLoading &&
          !isError &&
          employees.length > 0 &&
          employees.map((employee, index) => (
            <TableRow
              key={employee.id || employee._id || index}
              className="border-b border-border hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary">
                    {employee.name?.charAt(0)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-5">{employee.username}</TableCell>
              <TableCell className="px-6 py-5">••••••••</TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap">{employee.email}</TableCell>
              <TableCell className="px-6 py-5">{employee.mobile}</TableCell>
              <TableCell className="px-6 py-5">{employee.address}</TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap">{employee.join_date}</TableCell>
              <TableCell className="px-6 py-5 min-w-[420px]">
                <div className="flex flex-wrap gap-2">
                  {(employee.permission || "")
                    .split("|")
                    .filter(Boolean)
                    .map((permission, idx) => (
                      <span
                        key={`${permission}-${idx}`}
                        className="rounded-xl border border-primary/10 bg-primary/10 px-3 py-1 text-xs font-medium text-primary whitespace-nowrap"
                      >
                        {permission.trim()}
                      </span>
                    ))}
                </div>
              </TableCell>

              {/* ACTION */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Link href={`/employee-manage/edit-employee/${employee.staff_id}`}>
                    <button
                      className="
                        flex h-10 w-10 items-center justify-center
                        rounded-2xl border border-blue-500/20
                        bg-blue-500/10 text-blue-500
                        transition-all hover:scale-105
                        hover:bg-blue-500 hover:text-white
                      "
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteEmployee(employee.staff_id)}
                    disabled={deleteEmployeeMutation.isPending}
                    className=" flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all hover:scale-105 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 "
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}

        {/* EMPTY STATE */}
        {!isLoading && !isError && employees.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
              No employees found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
