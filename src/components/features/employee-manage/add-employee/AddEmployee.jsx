"use client";

import { useState } from "react";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useAddEmployeeMutation } from "@/services/employeemanage/employee.mutation";
import { useAdminPermissionListQuery } from "@/services/employeemanage/employee.query";

export default function AddEmployee() {
  const { data } = useAdminPermissionListQuery();
  const permissions = data?.response || [];

  const { mutate, isPending } = useAddEmployeeMutation();

  const [formData, setFormData] = useState({
    user_name: "",
    user_mobile: "",
    user_email: "",
    user_adress: "",
    username: "",
    password: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // INPUT CHANGE
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // PERMISSION SELECT
  const handlePermissionChange = permissionId => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  };

  // SELECT ALL
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map(item => item.id));
    }
  };

  // SUBMIT
  const handleSubmit = e => {
    e.preventDefault();

    mutate(
      {
        ...formData,
        permission: selectedPermissions.join(","),
      },
      {
        onSuccess: () => {
          setFormData({
            user_name: "",
            user_mobile: "",
            user_email: "",
            user_adress: "",
            username: "",
            password: "",
          });

          setSelectedPermissions([]);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <FormSection title="Add Staff Employee" description="Create employee and assign permissions">
        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}

          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="Full Name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            <FormInput
              label="Email"
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <FormInput
              label="Phone Number"
              name="user_mobile"
              value={formData.user_mobile}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <FormInput
              label="Address"
              name="user_adress"
              value={formData.user_adress}
              onChange={handleChange}
              placeholder="Enter address"
            />

            <FormInput
              label="Login Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />

            <FormInput
              label="Login Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          {/* PERMISSION */}

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
                {selectedPermissions.length === permissions.length ? "Unselect All" : "Select All"}
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
                    checked={selectedPermissions.includes(permission.id)}
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
                title={isPending ? "Creating..." : "Create Employee"}
                disabled={isPending}
              />
            </div>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
