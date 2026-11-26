'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '../data/siteConfig';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState(null);

  // Hidden on homepage Cover Page
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Desktop Top Header */}
      <header className="Header Header--top">
        <div className="Header-top-inner">
          <nav className="Header-nav Header-nav--primary" aria-label="Primary Navigation">
            {SITE_CONFIG.navTree.map((item) => {
              if (item.type === 'folder') {
                return (
                  <span key={item.label} className="Header-nav-item Header-nav-item--folder">
                    <Link href={item.href} className="Header-nav-folder-title">
                      {item.label}
                    </Link>
                    <span className="Header-nav-folder">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="Header-nav-folder-item"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </span>
                  </span>
                );
              }
              return (
                <Link key={item.label} href={item.href} className="Header-nav-item">
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Top Right Shopping Cart Icon */}
          <div className="Header-cart" title="Shopping Cart (0 items)">
            <svg
              width="20"
              height="18"
              viewBox="0 0 24 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="18" cy="19" r="1.5" />
              <path d="M1 1h4l2.4 12.2a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 5H6" />
            </svg>
            <span className="Header-cart-badge">0</span>
          </div>
        </div>
      </header>

      {/* Desktop Bottom Header (Centered Crest Logo) */}
      <header className="Header Header--bottom">
        <Link href="/" className="Header-branding">
          <img
            src={SITE_CONFIG.logoUrl}
            alt={SITE_CONFIG.siteTitle}
            className="Header-branding-logo"
          />
        </Link>
      </header>

      {/* Mobile Header Bar */}
      <div className="Mobile-bar">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link href="/" className="Header-branding">
          <img
            src={SITE_CONFIG.logoUrl}
            alt={SITE_CONFIG.siteTitle}
            style={{ maxWidth: '110px', height: 'auto', display: 'block' }}
          />
        </Link>

        <div style={{ width: '36px' }} />
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileOpen && (
        <div className="Mobile-overlay">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '28px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SITE_CONFIG.navTree.map((item) => {
              if (item.type === 'folder') {
                const isExpanded = expandedFolder === item.label;
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFolder(isExpanded ? null : item.label)
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{isExpanded ? '−' : '+'}</span>
                    </button>
                    {isExpanded && (
                      <div
                        style={{
                          paddingLeft: '16px',
                          marginTop: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: '13px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
