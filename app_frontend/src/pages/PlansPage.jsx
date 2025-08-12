import React, { useState } from "react";
import AppLayout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

/**
 * PlansPage lets the user switch between normal, premium, and ultra plans.
 */

const PLANS = [
  { id: "normal", name: "Normal", desc: "Basic access with limited features." },
  { id: "premium", name: "Premium", desc: "Enhanced features and higher limits." },
  { id: "ultra", name: "Ultra", desc: "All features with maximum limits." },
];

export default function PlansPage() {
  const { user, updateUserPlan } = useAuth();
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  async function handleChangePlan(plan) {
    setUpdating(plan);
    setError(null);
    try {
      await updateUserPlan(plan);
    } catch (e) {
      setError(e?.message || "Failed to update plan");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <AppLayout>
      <h1 className="title">Manage your plan</h1>
      <p className="subtitle">Current plan: <strong>{user?.plan}</strong></p>

      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="plans">
        {PLANS.map((p) => {
          const active = user?.plan === p.id;
          return (
            <div key={p.id} className={`plan-card ${active ? "active" : ""}`}>
              <h3>{p.name}</h3>
              <p className="desc">{p.desc}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleChangePlan(p.id)}
                disabled={active || updating === p.id}
              >
                {active ? "Current plan" : updating === p.id ? "Updating..." : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
