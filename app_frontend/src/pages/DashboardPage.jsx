import React, { useState } from "react";
import AppLayout from "../components/Layout";
import { callPlanApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * Dashboard shows a control to invoke the backend API which behaves based on the user's plan.
 */

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  async function handleCall() {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    try {
      const res = await callPlanApi({ query: "demo" });
      setApiResponse(res);
    } catch (e) {
      setError(e?.message || "Failed to call API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <h1 className="title">Dashboard</h1>
      <p className="subtitle">Your current plan: <strong>{user?.plan}</strong></p>

      <div className="card">
        <p>Click the button to call the plan-gated API. The response will differ based on your plan.</p>
        <button className="btn btn-primary" onClick={handleCall} disabled={loading}>
          {loading ? "Calling..." : "Call API"}
        </button>

        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}

        {apiResponse && (
          <div className="result" style={{ marginTop: 16 }}>
            <div><strong>Message:</strong> {apiResponse.message}</div>
            <div><strong>Plan:</strong> {apiResponse.plan}</div>

            {apiResponse.plan === "normal" && (
              <div className="info info-normal" data-testid="normal-plan-msg">
                You are using the normal package.
              </div>
            )}
            {apiResponse.plan === "premium" && (
              <div className="info info-premium">
                Premium perks unlocked: faster responses and higher limits.
              </div>
            )}
            {apiResponse.plan === "ultra" && (
              <div className="info info-ultra">
                Ultra pack: access to all features and priority processing.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
