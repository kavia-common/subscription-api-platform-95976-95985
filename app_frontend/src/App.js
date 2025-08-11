import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [apiResponse, setApiResponse] = useState(null);
  const [userSubscription, setUserSubscription] = useState('normal'); // For demonstration, set to 'normal'
  const [showNormalMsg, setShowNormalMsg] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  /**
   * Simulate an API call and show relevant messages based on user's subscription plan.
   */
  const handleApiCall = () => {
    setLoadingApi(true);
    setApiResponse(null);
    setShowNormalMsg(false);

    // Simulate a server round-trip
    setTimeout(() => {
      // Simulate a mock API response (could be replaced by real fetch call)
      const response = {
        success: true,
        message: 'API data result: Welcome!',
        plan: userSubscription,
      };
      setApiResponse(response);

      if (response.plan === 'normal') {
        setShowNormalMsg(true);
      }
      setLoadingApi(false);
    }, 800);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* API Call UI Area */}
        <div style={{
          padding: '2rem',
          marginTop: '2rem',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          background: 'var(--bg-secondary)',
          width: '100%',
          maxWidth: 440
        }}>
          <div style={{ marginBottom: '1rem', fontWeight: 500 }}>
            Subscription plan: <span style={{ color: '#1976d2' }}>{userSubscription}</span>
          </div>
          <button
            style={{
              background: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              border: 0,
              borderRadius: 8,
              padding: '10px 28px',
              fontSize: 15,
              cursor: loadingApi ? 'not-allowed' : 'pointer',
              opacity: loadingApi ? 0.7 : 1,
              marginBottom: '1.2rem',
            }}
            disabled={loadingApi}
            onClick={handleApiCall}
          >
            {loadingApi ? 'Loading...' : 'Call API'}
          </button>

          {/* Display API Response */}
          {apiResponse && (
            <div style={{ 
              marginBottom: showNormalMsg ? '1.2rem' : 0,
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}>
              <span style={{ fontWeight: 500 }}>API Result:</span> {apiResponse.message}
            </div>
          )}

          {/* Conditional Message for 'normal' plan */}
          {showNormalMsg && (
            <div
              style={{
                marginTop: 0,
                padding: '0.75rem 1rem',
                background: '#fff0fa',
                border: '1.5px solid #ff4081',
                borderRadius: '8px',
                color: '#ff4081',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 0 9px rgba(255, 64, 129, 0.05)'
              }}
              data-testid="normal-plan-msg"
            >
              You are using the normal package.
            </div>
          )}

        </div>
      </header>
    </div>
  );
}

export default App;
