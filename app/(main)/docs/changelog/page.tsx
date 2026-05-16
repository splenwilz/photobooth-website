"use client";

import Link from "next/link";
import { useReleases } from "@/core/api/releases";

/**
 * Format date for display
 */
function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ChangelogPage() {
  // Fetch releases - backend will use default pagination
  const { data, isLoading, error } = useReleases();

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Header Skeleton */}
        <section className="relative pt-16 pb-12 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#069494]/10 blur-[200px] rounded-full" />

          <div className="relative max-w-4xl mx-auto">
            <div className="h-5 w-32 bg-[var(--card)] rounded animate-pulse mb-8" />
            <div className="inline-flex h-8 w-36 rounded-full bg-[var(--card)] animate-pulse mb-6" />
            <div className="h-12 w-48 bg-[var(--card)] rounded-xl animate-pulse mb-4" />
            <div className="h-6 w-96 max-w-full bg-[var(--card)] rounded-lg animate-pulse" />
          </div>
        </section>

        {/* Timeline Skeleton */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#069494] via-[#069494]/50 to-transparent" />

              <div className="space-y-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative pl-12">
                    {/* Timeline dot skeleton */}
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-[var(--card)] border-2 border-[var(--border)] animate-pulse" />

                    {/* Release card skeleton */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                      {/* Header */}
                      <div className="p-6 border-b border-[var(--border)]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-24 bg-[var(--border)] rounded-lg animate-pulse" />
                          {i === 1 && <div className="h-6 w-16 bg-[var(--border)] rounded-full animate-pulse" />}
                        </div>
                        <div className="flex gap-4">
                          <div className="h-4 w-28 bg-[var(--border)] rounded animate-pulse" />
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="h-5 w-3/4 bg-[var(--border)] rounded animate-pulse" />
                          <div className="h-4 w-full bg-[var(--border)] rounded animate-pulse" />
                          <div className="h-4 w-full bg-[var(--border)] rounded animate-pulse" />
                          <div className="h-4 w-2/3 bg-[var(--border)] rounded animate-pulse" />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg aria-hidden="true" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to load changelog</h2>
          <p className="text-[var(--muted)] mb-4">Please try again later.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const releases = data.releases;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <section className="relative pt-16 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#069494]/10 blur-[200px] rounded-full" />

        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Docs
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#176161] dark:text-[#0EC7C7] text-sm font-medium mb-6">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Version History
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            A complete history of BoothIQ releases, including new features, improvements, and bug fixes.
          </p>
        </div>
      </section>

      {/* Releases Timeline */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#069494] via-[#069494]/50 to-transparent" />

            <div className="space-y-12">
              {releases.map((release, index) => {
                const version = release.tag_name.replace(/^v/, "");
                const date = formatReleaseDate(release.published_at);
                const isLatest = index === 0;

                return (
                  <div key={release.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isLatest
                        ? "bg-[#10B981] text-white"
                        : "bg-[var(--card)] border-2 border-[#069494]/30 text-[#069494]"
                    }`}>
                      {isLatest ? (
                        <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      )}
                    </div>

                    {/* Release card */}
                    <div className={`rounded-2xl border overflow-hidden ${
                      isLatest
                        ? "bg-gradient-to-br from-[#10B981]/10 to-[var(--card)] border-[#10B981]/30"
                        : "bg-[var(--card)] border-[var(--border)]"
                    }`}>
                      {/* Header */}
                      <div className="p-6 border-b border-[var(--border)]">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold font-mono">v{version}</h2>
                          {isLatest && (
                            <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-white text-xs font-semibold">
                              Latest
                            </span>
                          )}
                          {release.prerelease && (
                            <span className="px-2.5 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold">
                              Pre-release
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
                          <span className="flex items-center gap-1.5">
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {date}
                          </span>
                        </div>
                      </div>

                      {/* Release notes */}
                      <div className="p-6">
                        {release.body_html ? (
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from GitHub API (trusted source)
                          <div
                            className="prose prose-zinc dark:prose-invert max-w-none prose-sm prose-headings:font-semibold prose-h2:text-lg prose-h3:text-base prose-a:text-[#069494] prose-ul:list-disc prose-li:marker:text-[#10B981]"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from GitHub API (trusted source)
                            dangerouslySetInnerHTML={{ __html: release.body_html }}
                          />
                        ) : release.body ? (
                          <div className="prose prose-zinc dark:prose-invert max-w-none prose-sm whitespace-pre-wrap">
                            {release.body}
                          </div>
                        ) : (
                          <p className="text-[var(--muted)]">
                            {release.name || `Release ${version}`}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination info */}
          {data.pagination && data.pagination.total_pages > 1 && (
            <div className="mt-12 text-center text-[var(--muted)]">
              <p>
                Showing {releases.length} of {data.pagination.total_items} releases
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
