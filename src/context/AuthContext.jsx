"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

const AuthContext = createContext(null);
const AUTH_CHANGE_EVENT = "novotrend-auth-change";
const AUTH_LOADING_SNAPSHOT = "__auth_loading__";
export const AUTH_SESSION_KEY = "novotrend-active-session";
const AUTH_SESSION_CHANNEL = "novotrend-auth-session-channel";
const AUTH_SESSION_REQUEST = "auth-session-request";
const AUTH_SESSION_RESPONSE = "auth-session-response";
const LAST_ACTIVITY_KEY = "novotrend-last-activity";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_HANDOFF_TIMEOUT_MS = 1000;
const ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"];

const clearAuthStorage = () => {
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
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};

const getStoredUserSnapshot = () => {
  if (typeof window === "undefined") return AUTH_LOADING_SNAPSHOT;

  try {
    const storedUser = localStorage.getItem("adminUser");
    const token = localStorage.getItem("token");

    if (storedUser) {
      return storedUser;
    }

    if (token) {
      return JSON.stringify({
        token,
        auth_secret: localStorage.getItem("auth_secret") || "",
        staff_id: localStorage.getItem("staff_id") || "",
        staff_name: localStorage.getItem("staff_name") || "",
        staff_username: localStorage.getItem("staff_username") || "",
        permission: JSON.parse(localStorage.getItem("permission") || "[]"),
      });
    }

    return "";
  } catch (error) {
    console.error("AUTH RESTORE ERROR:", error);
    localStorage.removeItem("adminUser");
    return "";
  }
};

const getServerSnapshot = () => AUTH_LOADING_SNAPSHOT;

const parseStoredUser = snapshot => {
  if (!snapshot || snapshot === AUTH_LOADING_SNAPSHOT) return null;

  try {
    return JSON.parse(snapshot);
  } catch (error) {
    console.error("AUTH PARSE ERROR:", error);
    return null;
  }
};

const subscribeToAuth = callback => {
  window.addEventListener("storage", callback);
  window.addEventListener("pageshow", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);

  queueMicrotask(callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pageshow", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
};

const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

const requestActiveSession = () => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    const requestId = `${Date.now()}-${Math.random()}`;
    const channel = new BroadcastChannel(AUTH_SESSION_CHANNEL);
    const timer = window.setTimeout(() => {
      channel.close();
      resolve(false);
    }, SESSION_HANDOFF_TIMEOUT_MS);

    channel.onmessage = event => {
      if (
        event.data?.type === AUTH_SESSION_RESPONSE &&
        event.data?.requestId === requestId
      ) {
        window.clearTimeout(timer);
        channel.close();
        resolve(true);
      }
    };

    channel.postMessage({ type: AUTH_SESSION_REQUEST, requestId });
  });
};

export const AuthProvider = ({ children }) => {
  const authSnapshot = useSyncExternalStore(
    subscribeToAuth,
    getStoredUserSnapshot,
    getServerSnapshot
  );
  const user = useMemo(() => parseStoredUser(authSnapshot), [authSnapshot]);
  const isAuthLoading = authSnapshot === AUTH_LOADING_SNAPSHOT;
  const isVerified =
    !isAuthLoading &&
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  const login = useCallback(userData => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("adminUser", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("staff_id", userData.staff_id || "");
    localStorage.setItem("staff_name", userData.staff_name || "");
    localStorage.setItem("staff_username", userData.staff_username || "");
    localStorage.setItem("permission", JSON.stringify(userData.permission || []));
    emitAuthChange();
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    emitAuthChange();
  }, []);

  useEffect(() => {
    if (isAuthLoading || typeof window === "undefined") return undefined;

    const token = localStorage.getItem("token");
    const verified = localStorage.getItem("isLoggedIn") === "true";

    if (!token || !verified) return undefined;

    let isEffectActive = true;

    const logoutForIdle = () => {
      logout();
      window.location.replace("/login");
    };

    const checkIdle = () => {
      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || Date.now());

      if (Date.now() - lastActivity >= IDLE_TIMEOUT_MS) {
        logoutForIdle();
      }
    };

    const recordActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    };

    const verifyTabSession = async () => {
      if (sessionStorage.getItem(AUTH_SESSION_KEY) === "true") return;

      const hasActiveSession = await requestActiveSession();

      if (!isEffectActive) return;

      if (hasActiveSession) {
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
        return;
      }

      logout();
      window.location.replace("/login");
    };

    verifyTabSession();

    if (!localStorage.getItem(LAST_ACTIVITY_KEY)) {
      recordActivity();
    }

    ACTIVITY_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });

    const idleTimer = window.setInterval(checkIdle, 30 * 1000);
    window.addEventListener("focus", checkIdle);
    window.addEventListener("pageshow", checkIdle);

    return () => {
      isEffectActive = false;
      ACTIVITY_EVENTS.forEach(eventName => {
        window.removeEventListener(eventName, recordActivity);
      });
      window.clearInterval(idleTimer);
      window.removeEventListener("focus", checkIdle);
      window.removeEventListener("pageshow", checkIdle);
    };
  }, [isAuthLoading, logout]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return undefined;
    }

    const channel = new BroadcastChannel(AUTH_SESSION_CHANNEL);

    channel.onmessage = event => {
      if (
        event.data?.type === AUTH_SESSION_REQUEST &&
        sessionStorage.getItem(AUTH_SESSION_KEY) === "true" &&
        localStorage.getItem("token") &&
        localStorage.getItem("isLoggedIn") === "true"
      ) {
        channel.postMessage({
          type: AUTH_SESSION_RESPONSE,
          requestId: event.data.requestId,
        });
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const setUser = userData => {
    if (userData) {
      login(userData);
      return;
    }

    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthLoading,
        isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
