"use client";

import { authenticator } from "@otplib/preset-default";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";

import { AUTH_SESSION_KEY } from "@/context/AuthContext";
import { useAuthMutation } from "@/services/auth/auth.mutation";

const AUTH_SNAPSHOT_LOADING = "__auth_snapshot_loading__";

const subscribeToAuthStorage = callback => {
  window.addEventListener("storage", callback);
  window.addEventListener("pageshow", callback);
  queueMicrotask(callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pageshow", callback);
  };
};

const getAuthSnapshot = () => {
  if (typeof window === "undefined") return AUTH_SNAPSHOT_LOADING;

  return `${localStorage.getItem("token") || ""}|${localStorage.getItem("auth_secret") || ""}|${
    localStorage.getItem("isLoggedIn") || ""
  }`;
};

const getServerAuthSnapshot = () => AUTH_SNAPSHOT_LOADING;

export default function AucationCode() {
  const router = useRouter();
  const authSnapshot = useSyncExternalStore(
    subscribeToAuthStorage,
    getAuthSnapshot,
    getServerAuthSnapshot
  );
  const isSnapshotLoading = authSnapshot === AUTH_SNAPSHOT_LOADING;
  const [token, authSecret, isLoggedIn] = isSnapshotLoading ? ["", "", ""] : authSnapshot.split("|");
  const [qrSecret, setQrSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useAuthMutation();

  useEffect(() => {
    if (isSnapshotLoading) return;

    if (token && isLoggedIn === "true") {
      window.location.replace("/");
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    const generateQr = async () => {
      if (authSecret === "0") {
        const secret = authenticator.generateSecret();
        const otpUrl = authenticator.keyuri("Novo Trend", "Novotrend", secret);
        const qr = await QRCode.toDataURL(otpUrl);

        localStorage.setItem("qr_secret", secret);
        setQrSecret(secret);
        setQrCode(qr);
      }
    };

    generateQr();
  }, [authSecret, isLoggedIn, isSnapshotLoading, router, token]);
  const showQr = authSecret === "0";
  const handleBackToLogin = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_secret");
    localStorage.removeItem("qr_secret");
    localStorage.removeItem("qr_code");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("staff_id");
    localStorage.removeItem("staff_name");
    localStorage.removeItem("staff_username");
    localStorage.removeItem("permission");
    localStorage.removeItem("novotrend-last-activity");
    sessionStorage.removeItem(AUTH_SESSION_KEY);

    window.location.replace("/login");
  };

  const onSubmit = values => {
    setErrorMessage("");

    const payload = {
      token,
      authcode: values.code,
    };
    // only first time login
    if (showQr) {
      payload.secret = qrSecret;
    }
        mutate(payload, {
      onSuccess: () => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("novotrend-last-activity", String(Date.now()));
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
        localStorage.removeItem("qr_secret");
        localStorage.removeItem("qr_code");

        window.location.replace("/");
      },
      onError: error => {
        setErrorMessage(error?.message || "Verification failed. Please try again.");
      },
    });
  };
  if (isSnapshotLoading || !token) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817]">
      <div className="absolute inset-0">
        <Image src="/forex.jpg" alt="Background" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <Image
              src="/lightmode.png"
              alt="Logo"
              width={170}
              height={50}
              className="mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-white">Authentication Code</h1>
            <p className="mt-3 text-sm text-slate-400">Enter verification code</p>
          </div>
          {showQr && (
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-center text-sm font-semibold text-white">
                Scan QR Using Authenticator App
              </h3>
              {qrCode ? (
                <div className="flex justify-center">
                  <Image
                    src={qrCode}
                    alt="QR Code"
                    width={220}
                    height={220}
                    className="rounded-2xl bg-white p-3"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-yellow-500/10 p-4 text-center text-yellow-200">
                  Generating QR...
                </div>
              )}
              {/* <div className="mt-5">
                <p className="mb-2 text-center text-xs text-slate-400">Secret Key</p>
                <div className="break-all rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-white">
                  {qrSecret}
                </div>
              </div> */}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              maxLength={6}
              {...register("code", {
                onChange: () => setErrorMessage(""),
              })}
              placeholder="••••••"
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-center text-2xl tracking-[10px] text-white"
            />
            {errorMessage && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-2xl bg-primary text-white"
            >
              {isPending ? "Verifying..." : "Verify & Continue"}
            </button>
            <button type="button" onClick={handleBackToLogin} className="block w-full text-center text-primary">
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
