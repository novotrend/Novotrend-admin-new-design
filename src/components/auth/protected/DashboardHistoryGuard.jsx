"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function DashboardHistoryGuard() {
  const { isVerified, user } = useAuth();

  useEffect(() => {
    if (!isVerified || !user?.token) return;

    const guardState = {
      ...(history.state || {}),
      novotrendDashboardGuard: true,
    };

    history.replaceState(guardState, "", window.location.href);
    history.pushState(guardState, "", window.location.href);

    const handlePopState = () => {
      if (localStorage.getItem("token") && localStorage.getItem("isLoggedIn") === "true") {
        history.pushState(guardState, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isVerified, user?.token]);

  return null;
}
