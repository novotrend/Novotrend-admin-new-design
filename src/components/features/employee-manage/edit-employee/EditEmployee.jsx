"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { toast } from "sonner";

import { useEditEmployeeMutation } from "@/services/employeemanage/employee.mutation";
import {
  useAdminPermissionListQuery,
  useAdminStaffListQuery,
} from "@/services/employeemanage/employee.query";

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();
  const editEmployeeMutation = useEditEmployeeMutation();

  const { data: permissionData } = useAdminPermissionListQuery();
  const { data: employeeData, isLoading } = useAdminStaffListQuery();

  const permissions = permissionData?.response || [];
  const employees = employeeData?.response?.employee_list || [];

  const employee = employees.find(item => String(item.staff_id) === String(id));

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_mobile: "",
    user_adress: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (!employee || permissions.length === 0) return;
    setFormData({
      user_name: employee.name || "",
      user_email: employee.email || "",
      user_mobile: employee.mobile || "",
      user_adress: employee.address || "",
      username: employee.username || "",
      password: employee.password || "",
    });

    // Permission Prefill
    const employeePermissionNames =
      employee.permission
        ?.split("|")
        .map(item => item.trim())
        .filter(Boolean) || [];

    const selectedIds = permissions
      .filter(permission => employeePermissionNames.includes(permission.name))
      .map(permission => String(permission.id));

    setSelectedPermissions(selectedIds);
  }, [employee, permissions]);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = permissionId => {
    const id = String(permissionId);

    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
      return;
    }

    setSelectedPermissions(permissions.map(item => String(item.id)));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      !formData.user_name ||
      !formData.user_email ||
      !formData.user_mobile ||
      !formData.username
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    editEmployeeMutation.mutate(
      {
        staff_id: Number(id),
        user_name: formData.user_name,
        user_mobile: formData.user_mobile,
        user_email: formData.user_email,
        user_adress: formData.user_adress,
        username: formData.username,
        password: formData.password,
        permission: selectedPermissions.join(","),
      },
      {
        onSuccess: () => {
          router.push("/employee-manage/list-employee");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading employee details...</div>;
  }

  if (!employee) {
    return <div className="p-10 text-center text-red-500">Employee not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <FormSection title="Edit Staff Employee" description="Edit employee and assign permissions">
        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}

          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="Full Name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
            />

            <FormInput
              label="Email"
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
            />

            <FormInput
              label="Phone Number"
              name="user_mobile"
              value={formData.user_mobile}
              onChange={handleInputChange}
            />

            <FormInput
              label="Address"
              name="user_adress"
              value={formData.user_adress}
              onChange={handleInputChange}
            />

            <FormInput
              label="Login Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />

            <FormInput
              label="Login Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* PERMISSIONS */}

          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Select Permission</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Assign access rights for employee
                </p>
              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
              >
                Select All
              </button>
            </div>

            <div className="grid gap-x-12 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              {permissions.map(permission => (
                <label
                  key={permission.id}
                  className="
                    group flex cursor-pointer items-center gap-4
                    rounded-2xl border border-border bg-card
                    px-5 py-4 transition-all
                    hover:border-primary/30 hover:bg-primary/5
                  "
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(String(permission.id))}
                    onChange={() => handlePermissionChange(permission.id)}
                    className="h-5 w-5 rounded border-border accent-primary"
                  />

                  <span className="text-base font-medium text-foreground">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ACTION */}

          <div className="mt-10 flex justify-end">
            <div className="w-[220px]">
              <FormSubmit
                title={editEmployeeMutation.isPending ? "Updating Employee..." : "Update Employee"}
                disabled={editEmployeeMutation.isPending}
              />
            </div>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
