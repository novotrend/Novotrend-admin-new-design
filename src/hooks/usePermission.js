"use client";

import { useAuth } from "@/context/AuthContext";
import { useAdminPermissionListQuery } from "@/services/employeemanage/employee.query";
import { useMemo } from "react";

export const usePermissions = () => {
  const { user, isAuthLoading } = useAuth();

  const adminPermissionIds = useMemo(() => (user?.permission || []).map(String), [user?.permission]);

  const { data, isLoading } = useAdminPermissionListQuery({
    enabled: !isAuthLoading && Boolean(user?.token) && adminPermissionIds.length > 0,
  });

  const allowedPermissions = useMemo(() => {
    const permissions = data?.response || [];

    return permissions
      .filter(item => adminPermissionIds.includes(String(item.id)))
      .map(item => item.name);
  }, [data, adminPermissionIds]);

  const hasPermission = permissionName => {
    return allowedPermissions.includes(permissionName);
  };

  return {
    hasPermission,
    allowedPermissions,
    isLoading: isAuthLoading || isLoading,
  };
};
