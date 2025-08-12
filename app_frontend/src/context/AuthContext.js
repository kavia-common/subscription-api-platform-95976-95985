import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login, signup, getCurrentUser, updatePlan as apiUpdatePlan } from "../services/api";

/**
 * AuthContext manages authentication state, provides login/signup/signout capabilities,
 * and exposes the current user and loading/error states to the application.
 */

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** AuthProvider wraps the app and provides authentication state and actions. */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore token and try to fetch the current user on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setInitializing(false);
      return;
    }
    getCurrentUser()
      .then((u) => setUser(u))
      .catch((e) => {
        console.warn("Failed to restore session:", e?.message);
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  // PUBLIC_INTERFACE
  const signIn = useCallback(async (email, password) => {
    /** Sign in user using backend API. Stores token in localStorage. */
    setAuthError(null);
    const res = await login(email, password);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
    return res.user;
  }, []);

  // PUBLIC_INTERFACE
  const signUp = useCallback(async (email, password, plan = "normal") => {
    /** Sign up user and store token, then set user state. */
    setAuthError(null);
    const res = await signup(email, password, plan);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
    return res.user;
  }, []);

  // PUBLIC_INTERFACE
  const signOut = useCallback(() => {
    /** Clear token and user state. */
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  // PUBLIC_INTERFACE
  const refreshUser = useCallback(async () => {
    /** Refetch current user data from backend. */
    const u = await getCurrentUser();
    setUser(u);
    return u;
  }, []);

  // PUBLIC_INTERFACE
  const updateUserPlan = useCallback(async (plan) => {
    /** Update user's plan and refresh local user state. */
    const u = await apiUpdatePlan(plan);
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      authError,
      signIn,
      signUp,
      signOut,
      refreshUser,
      updateUserPlan,
    }),
    [user, initializing, authError, signIn, signUp, signOut, refreshUser, updateUserPlan]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
