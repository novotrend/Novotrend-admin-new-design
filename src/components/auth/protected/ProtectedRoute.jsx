"use client";

import { sidebarItems } from "@/confiq/sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermission";
import {
  getAllowedSidebarItems,
  getFirstAllowedHref,
  isAllowedPath,
} from "@/lib/sidebarAccess";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isVerified, logout, user, isAuthLoading } = useAuth();
  const { allowedPermissions, isLoading: isPermissionLoading } = usePermissions();
  const allowedSidebarItems = getAllowedSidebarItems(sidebarItems, allowedPermissions);
  const firstAllowedHref = getFirstAllowedHref(allowedSidebarItems);
  const hasRouteAccess = isAllowedPath(pathname, allowedSidebarItems);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (isLoggedIn !== "true") {
      router.replace("/authcation");
      return;
    }

    if (!isAuthLoading && !user?.token) {
      logout();
      router.replace("/login");
      return;
    }

    if (!isAuthLoading && !isPermissionLoading && firstAllowedHref && !hasRouteAccess) {
      router.replace(firstAllowedHref);
    }
  }, [firstAllowedHref, hasRouteAccess, isAuthLoading, isPermissionLoading, logout, router, user?.token]);

  if (isAuthLoading || !isVerified || isPermissionLoading || !user?.token) {
    return null;
  }

  if (!firstAllowedHref) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground">No access available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact administrator to enable permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!hasRouteAccess) return null;

  return children;
}
