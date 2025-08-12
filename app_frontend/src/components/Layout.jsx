import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AppLayout wraps authenticated pages, providing navigation and a consistent layout.
 */

export default function AppLayout({ children }) {
  const { user, signOut } = useAuth();

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <Link to="/dashboard" className="brand-link">Subscription API Platform</Link>
        </div>
        <div className="user-area">
          <span className="user-email">{user?.email}</span>
          <span className="user-plan">Plan: {user?.plan}</span>
          <button className="btn btn-sm" onClick={signOut} aria-label="Sign out">Sign out</button>
        </div>
      </header>

      <div className="content">
        <aside className="sidebar">
          <nav className="nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
            <NavLink to="/plans" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Manage Plan</NavLink>
          </nav>
        </aside>

        <main className="main">
          {children}
          <footer style={{ marginTop: 32, textAlign: "center", opacity: 0.8 }}>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
