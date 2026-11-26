'use client';

import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';

const STORAGE_KEY = 'conley_trust_unlocked';

export default function PasswordGate({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lock') === '1') {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setIsUnlocked(false);
        setIsChecking(false);
        return;
      }
      const saved =
        sessionStorage.getItem(STORAGE_KEY) === 'true' ||
        localStorage.getItem(STORAGE_KEY) === 'true';
      if (saved) {
        setIsUnlocked(true);
      }
    } catch (e) {
      // ignore storage errors
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === SITE_CONFIG.password.toLowerCase()) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (err) {
        // ignore
      }
      setError(false);
      setIsUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  if (isChecking) {
    return null;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#EFEFEF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Circular Lock Icon matching Squarespace lock screen */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1.5px solid #A2A2A2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <svg
          width="22"
          height="26"
          viewBox="0 0 22 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 11V7C6 4.23858 8.23858 2 11 2C13.7614 2 16 4.23858 16 7V11"
            stroke="#A2A2A2"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="3" y="11" width="16" height="13" rx="1.5" fill="#A2A2A2" />
        </svg>
      </div>

      {/* Password Input Box */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '268px',
          height: '48px',
          backgroundColor: '#FFFFFF',
          border: error ? '1.5px solid #e74f26' : '1.5px solid #222222',
          padding: '0 12px 0 16px',
          transition: 'border-color 0.2s ease, transform 0.1s ease',
          transform: error ? 'translateX(-4px)' : 'none',
        }}
      >
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          aria-label="Password"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            letterSpacing: '0.6px',
            color: '#222222',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          aria-label="LogIn"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: password.length > 0 ? '#222222' : '#CCCCCC',
            transition: 'color 0.2s ease',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
      {error && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#e74f26',
            letterSpacing: '0.4px',
          }}
        >
          Incorrect password. Try &quot;Conley&quot;.
        </div>
      )}
    </div>
  );
}
