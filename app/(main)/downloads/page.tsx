"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  useLatestRelease,
  useReleases,
  formatFileSize,
  getAssetDownloadUrl,
  type Release,
  type ReleaseAsset,
} from "@/core/api/releases";

/* ============================================
 * Skeleton Components for inline loading
 * ============================================ */

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-[var(--border)] animate-pulse rounded ${className ?? ""}`}
    />
  );
}

/* ============================================
 * Helper Functions
 * ============================================ */

function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWindowsAsset(release: Release): ReleaseAsset | undefined {
  if (!release.assets || release.assets.length === 0) {
    return undefined;
  }

  let asset = release.assets.find(
    (a) => a.platform === "windows" && a.architecture === "x64"
  );
  if (asset) return asset;

  asset = release.assets.find((a) => a.platform === "windows");
  if (asset) return asset;

  asset = release.assets.find((a) => {
    const name = a.name.toLowerCase();
    if (name.includes("darwin") || name.includes("macos") || name.includes("linux")) {
      return false;
    }
    return name.includes("windows") || name.endsWith(".exe") || name.endsWith(".msi");
  });
  if (asset) return asset;

  return undefined;
}

function getTotalDownloads(release: Release): number {
  return release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
}

function formatDownloadCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+`;
  }
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k+`;
  }
  return count.toString();
}

/* ============================================
 * Static Data
 * ============================================ */

const systemReqs = {
  minimum: {
    os: "Windows 10 (64-bit)",
    ram: "4 GB RAM",
    disk: "500 MB disk space",
    display: "1280x720 display",
    usb: "USB 2.0 port",
  },
  recommended: {
    os: "Windows 11 (64-bit)",
    ram: "8 GB RAM or more",
    disk: "1 GB disk space",
    display: "1920x1080 display",
    usb: "USB 3.0 port",
  },
};

/* ============================================
 * Main Component
 * ============================================ */

export default function DownloadsPage() {
  const [showAllVersions, setShowAllVersions] = useState(false);

  // Fetch data
  const { data: latestData, isLoading: isLoadingLatest, error: latestError } = useLatestRelease();
  const { data: releasesData, isLoading: isLoadingReleases } = useReleases({ page: 1, per_page: 10 });

  // Derived data
  const latestRelease = latestData?.release;
  const windowsAsset = latestRelease ? getWindowsAsset(latestRelease) : undefined;
  const releases = releasesData?.releases;
  const latestReleaseId = latestRelease?.id;

  const previousVersions = useMemo(() => {
    if (!releases || !latestReleaseId) return [];
    return releases.filter((r) => r.id !== latestReleaseId);
  }, [releases, latestReleaseId]);

  const totalDownloads = useMemo(() => {
    if (!releases) return 0;
    return releases.reduce((sum, release) => sum + getTotalDownloads(release), 0);
  }, [releases]);

  // Computed display values
  const version = latestRelease?.tag_name.replace(/^v/, "");
  const releaseDate = latestRelease ? formatReleaseDate(latestRelease.published_at) : null;
  const downloadUrl = windowsAsset ? getAssetDownloadUrl(windowsAsset.id) : "#";
  const fileSize = windowsAsset ? formatFileSize(windowsAsset.size) : null;
  const downloadsDisplay = latestRelease
    ? formatDownloadCount(totalDownloads || getTotalDownloads(latestRelease))
    : null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       *
       * Audience: existing operators who already have BoothIQ pre-installed
       * on a BoothWorks booth and need an update or re-install. Also
       * usable by BYO-hardware operators setting up on their own Windows
       * machine. The page is NOT a "buy our software" funnel.
       *
       * Top padding clears the sticky navbar (~96-100px tall) on every
       * breakpoint — same fix as the pricing/features hero.
       * ============================================ */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#069494]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#069494]/8 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center">
            {/* Version badge — dynamic version from API */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Latest version {isLoadingLatest ? <Skeleton className="w-12 h-4" /> : version}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Download BoothIQ
            </h1>

            {/* Honest subhead — names the actual audience instead of the
                generic "buy our software" pitch. Most operators already
                have this installed; this page is for updates/reinstalls. */}
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
              The Windows app that runs on your booth. Most BoothIQ booths
              ship with it pre-installed by BoothWorks — this page is for
              updates, re-installs, and bring-your-own-hardware setups.
            </p>

            {/* Download button — dynamic values */}
            <div className="flex flex-col items-center gap-4">
              {latestError ? (
                <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-500 font-medium mb-2">Unable to load download</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <a
                  href={isLoadingLatest ? "#" : downloadUrl}
                  className={`group flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-black font-semibold transition-all shadow-2xl shadow-white/20 ${
                    isLoadingLatest ? "opacity-70 cursor-wait" : "hover:bg-zinc-100 hover:scale-105"
                  }`}
                  onClick={(e) => isLoadingLatest && e.preventDefault()}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                  </svg>
                  <div className="text-left">
                    <div className="text-lg">Download for Windows</div>
                    <div className="text-sm font-normal text-[var(--muted)]">
                      Version {isLoadingLatest ? <Skeleton className="w-10 h-3" /> : version} ·{" "}
                      {isLoadingLatest ? <Skeleton className="w-14 h-3" /> : fileSize ?? "N/A"}
                    </div>
                  </div>
                  <svg className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}

              {/* Honest meta line: only the things we can actually back.
                  Drops "Verified safe" (stock claim) and the trial line. */}
              <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                <span>Windows 10 or later (64-bit)</span>
                <span>·</span>
                <span>
                  {isLoadingLatest ? <Skeleton className="w-16 h-4" /> : `${downloadsDisplay} downloads`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * What's New Section
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#0a0a0a] dark:via-[#111111]/30 dark:to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#10B981]/5 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#069494]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header - static with dynamic version */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#069494]/20 via-[#069494]/10 to-transparent border border-[#069494]/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#069494] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#069494]" />
              </span>
              <span className="text-[#069494] dark:text-[#0EC7C7] font-semibold">New Release</span>
              <span className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
              <span className="text-[var(--foreground)] font-mono font-bold">
                v{isLoadingLatest ? <Skeleton className="w-10 h-4" /> : version}
              </span>
              <span className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
              <span className="text-[var(--muted)] text-sm">
                {isLoadingLatest ? <Skeleton className="w-24 h-4" /> : releaseDate}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What&apos;s New in This Release
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              {isLoadingLatest ? (
                <Skeleton className="w-48 h-5" />
              ) : (
                latestRelease?.name || `Release ${version}`
              )}
            </p>
          </div>

          {/* Release Notes Content - dynamic */}
          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              {isLoadingLatest ? (
                <div className="space-y-4">
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                  <Skeleton className="w-1/2 h-6 mt-6" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                </div>
              ) : latestRelease?.body_html ? (
                <div
                  className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-[#069494] dark:prose-a:text-[#0EC7C7] prose-ul:list-disc prose-li:marker:text-[#069494]"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from GitHub API (trusted source)
                  dangerouslySetInnerHTML={{ __html: latestRelease.body_html }}
                />
              ) : latestRelease?.body ? (
                <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap">
                  {latestRelease.body}
                </div>
              ) : (
                <p className="text-[var(--muted)] text-center">
                  No release notes available for this version.
                </p>
              )}
            </div>
          </div>

          {/* View Full Changelog - static */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Want to see all versions?</p>
                <p className="text-sm text-[var(--muted)]">Browse the complete changelog</p>
              </div>
              <Link
                href="/docs/changelog"
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * System Requirements
       *
       * Just the Min vs Recommended specs. The original section here
       * was a duplicate of the hero (second header, second download
       * button, fake "4.9 Rating" trust badge, stock "Verified Safe"
       * tag). All of that was deleted because the hero already has
       * the download — only the requirements were genuinely useful.
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#0a0a0a] dark:to-[#111111]/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#069494]/5 blur-[200px] rounded-full" />

        <div className="relative max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
              System Requirements
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What you&apos;ll need
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              BoothIQ runs on Windows. Here&apos;s what your booth&apos;s
              machine needs.
            </p>
          </div>

          {/* Two-column requirements grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Minimum */}
            <div className="p-6 md:p-7 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="mb-5">
                <h3 className="font-semibold text-lg text-[var(--foreground)]">Minimum</h3>
                <p className="text-sm text-[var(--muted)]">It&apos;ll run.</p>
              </div>
              <ul className="space-y-2.5 text-sm text-[var(--muted)]">
                {Object.values(systemReqs.minimum).map((req) => (
                  <li key={req} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended */}
            <div className="p-6 md:p-7 rounded-2xl bg-gradient-to-br from-[#069494]/10 to-transparent border border-[#069494]/30">
              <div className="mb-5">
                <h3 className="font-semibold text-lg text-[var(--foreground)]">Recommended</h3>
                <p className="text-sm text-[var(--muted)]">Smooth experience.</p>
              </div>
              <ul className="space-y-2.5 text-sm text-[var(--foreground-secondary)]">
                {Object.values(systemReqs.recommended).map((req) => (
                  <li key={req} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#069494]" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Previous Versions - Dynamic list
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Version History
            </div>
            <h2 className="text-3xl font-bold mb-4">Previous Versions</h2>
            <p className="text-[var(--muted)]">
              Need an older version? Download previous releases below.
            </p>
          </div>

          <div>
            {isLoadingReleases ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-48 h-4" />
                      </div>
                    </div>
                    <Skeleton className="w-24 h-10 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : previousVersions.length === 0 ? (
              <p className="text-center text-[var(--muted)] py-8">
                No previous versions available.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-end mb-6">
                  <button
                    type="button"
                    onClick={() => setShowAllVersions(!showAllVersions)}
                    className="text-sm text-[#069494] hover:text-[#0EC7C7] transition-colors"
                  >
                    {showAllVersions ? "Show less" : "View all versions"}
                  </button>
                </div>
                <div className="space-y-3">
                  {previousVersions.slice(0, showAllVersions ? undefined : 3).map((release) => {
                    const prevWindowsAsset = getWindowsAsset(release);
                    const prevVersion = release.tag_name.replace(/^v/, "");
                    const prevDate = formatShortDate(release.published_at);
                    const prevSize = prevWindowsAsset ? formatFileSize(prevWindowsAsset.size) : "N/A";
                    const prevDownloadUrl = prevWindowsAsset ? getAssetDownloadUrl(prevWindowsAsset.id) : "#";

                    return (
                      <div
                        key={release.id}
                        className="group flex items-center justify-between p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#069494]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--muted)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono font-bold text-lg">v{prevVersion}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-[var(--muted)] text-xs">{prevDate}</span>
                              <span className="text-xs text-[var(--muted)]">{prevSize}</span>
                            </div>
                            <p className="text-sm text-[var(--muted)] line-clamp-1">
                              {release.name || `Release ${prevVersion}`}
                            </p>
                          </div>
                        </div>
                        {prevWindowsAsset && (
                          <a
                            href={prevDownloadUrl}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Static security notice */}
            <div className="mt-8 p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#F59E0B] font-semibold mb-1">Security Recommendation</p>
                  <p className="text-sm text-[var(--muted)]">
                    We strongly recommend always using the latest version for security updates, bug fixes, and new features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Help CTA - Fully Static
       * ============================================ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need help getting started?</h2>
          <p className="text-[var(--muted)] mb-8">
            Check out our comprehensive setup guide or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs/getting-started"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Setup Guide
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--foreground-secondary)] font-medium hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
