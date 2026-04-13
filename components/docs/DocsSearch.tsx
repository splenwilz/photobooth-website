"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sidebarSections } from "@/app/(main)/docs/_data/sidebar";

interface SearchResult {
  title: string;
  href: string;
  section: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const section of sidebarSections) {
    results.push({
      title: section.title,
      href: section.href,
      section: section.title,
    });
    for (const item of section.items) {
      results.push({
        title: item.title,
        href: item.href,
        section: section.title,
      });
    }
  }
  return results;
}

const allResults = buildIndex();
const RESULT_ID_PREFIX = "docs-search-result-";

export default function DocsSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  const filtered = query.trim()
    ? allResults.filter((r) => {
        const q = query.trim().toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q)
        );
      })
    : [];

  const visibleResults = filtered.slice(0, 20);
  const showDropdown = open && query.trim().length > 0;

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(
      `#${RESULT_ID_PREFIX}${activeIndex}`
    );
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // ⌘K / Ctrl+K to focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setQuery("");
      setOpen(false);
      setActiveIndex(-1);
      router.push(href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || visibleResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < visibleResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : visibleResults.length - 1
      );
    } else if (
      e.key === "Enter" &&
      activeIndex >= 0 &&
      activeIndex < visibleResults.length
    ) {
      e.preventDefault();
      navigate(visibleResults[activeIndex].href);
    }
  }

  const activeDescendant =
    activeIndex >= 0 ? `${RESULT_ID_PREFIX}${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto mb-16 relative z-40">
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search the docs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => { setOpen(true); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          className="w-full pl-14 pr-20 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#069494]/50 focus:ring-2 focus:ring-[#069494]/20 transition-all text-base"
          aria-label="Search documentation"
          aria-expanded={showDropdown}
          aria-controls="docs-search-results"
          aria-activedescendant={activeDescendant}
          role="combobox"
          aria-autocomplete="list"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <kbd className="text-xs text-[var(--muted)] border border-[var(--border)] px-1.5 py-0.5 rounded-md font-mono">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </div>
      </div>

      {showDropdown && (
        <div
          ref={listRef}
          id="docs-search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--border)] shadow-2xl z-40 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900"
        >
          {filtered.length === 0 ? (
            <div className="px-5 py-4 text-sm text-[var(--muted)]">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            visibleResults.map((result, i) => (
              <button
                key={result.href}
                id={`${RESULT_ID_PREFIX}${i}`}
                role="option"
                tabIndex={-1}
                aria-selected={i === activeIndex}
                onClick={() => navigate(result.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-5 py-3 flex items-center justify-between gap-4 transition-colors ${
                  i === activeIndex
                    ? "bg-[#069494]/10"
                    : "hover:bg-[#069494]/5"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)] truncate">
                    {result.title}
                  </div>
                  <div className="text-xs text-[var(--muted)] truncate">
                    {result.section}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-[var(--muted)] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
