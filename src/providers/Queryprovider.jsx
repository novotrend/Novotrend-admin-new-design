"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function QueryProvider({ children }) {
  useEffect(() => {
    const handlePageShow = () => {
      if (localStorage.getItem("token") && localStorage.getItem("isLoggedIn") === "true") {
        queryClient.invalidateQueries();
        queryClient.refetchQueries({
          type: "active",
        });
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
