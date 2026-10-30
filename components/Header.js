"use client";
// Header: logo (left), top buttons + search (right), main menu with dropdowns (below).
// Every item comes from Django Admin through the /api/homepage/ endpoint.
import { useState } from "react";

function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M15.5 15.5L22 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ settings, topButtons, navItems }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(`${settings.search_url}${encodeURIComponent(query.trim())}`, "_blank", "noopener");
  };

  return (
    <header className="container">
      <div className="header-top">
        <a className="logo" href={settings.logo_link || "#"} target="_blank" rel="noopener noreferrer">
          {settings.logo_src ? (
            <img src={settings.logo_src} alt={settings.site_name} />
          ) : (
            <span className="logo-text">{settings.site_name}</span>
          )}
        </a>

        <div className="top-actions">
          {topButtons.map((btn) => (
            <a key={btn.id} className="top-btn" href={btn.url || "#"} target="_blank" rel="noopener noreferrer">
              {btn.label}
            </a>
          ))}
          {settings.show_search && (
            <div className="search-wrap">
              <button
                className="search-btn"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((o) => !o)}
              >
                <SearchIcon />
              </button>
              {searchOpen && (
                <form className="search-form" onSubmit={submitSearch}>
                  <input
                    autoFocus
                    type="search"
                    placeholder="Search ughe.org"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="submit">Search</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="main-nav" aria-label="Main">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              {item.children.length > 0 ? (
                <>
                  <button className="nav-link" aria-haspopup="true">
                    {item.label} <Chevron />
                  </button>
                  <ul className="dropdown">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a href={child.url || "#"} target="_blank" rel="noopener noreferrer">{child.label}</a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a className="nav-link" href={item.url || "#"} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
