"use client";

/**
 * Admin Users Management Page
 *
 * Displays paginated list of users with search, filtering, and sorting.
 */

import { useState, useEffect } from "react";
import {
  useAdminUsers,
  type AdminUsersQueryParams,
} from "@/core/api/admin/users";
import UserDetailPanel from "./UserDetailPanel";

type FilterStatus = "all" | "active" | "inactive";
type SortField = "name" | "email" | "revenue" | "total_booths" | "created_at";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const perPage = 20;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query params
  const queryParams: AdminUsersQueryParams = {
    page,
    per_page: perPage,
    status: filterStatus,
    search: debouncedSearch || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const { data, isLoading, error } = useAdminUsers(queryParams);

  const handleStatusFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setPage(1);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const summary = data?.summary ?? {
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    total_revenue: 0,
  };

  const users = data?.users ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Users
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage platform users and accounts
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Total Users</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
            {isLoading ? "—" : summary.total_users}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Active</p>
          <p className="text-2xl font-bold mt-1 text-green-500">
            {isLoading ? "—" : summary.active_users}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Inactive</p>
          <p className="text-2xl font-bold mt-1 text-red-500">
            {isLoading ? "—" : summary.inactive_users}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Total Revenue</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
            {isLoading ? "—" : formatCurrency(summary.total_revenue)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
          {(["all", "active", "inactive"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                filterStatus === status
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-") as [SortField, "asc" | "desc"];
              setSortBy(field);
              setSortOrder(order);
              setPage(1);
            }}
            className="appearance-none px-4 py-3 pr-10 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] transition-all cursor-pointer"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="revenue-desc">Highest Revenue</option>
            <option value="revenue-asc">Lowest Revenue</option>
            <option value="total_booths-desc">Most Booths</option>
            <option value="total_booths-asc">Fewest Booths</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load users. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users List */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate text-zinc-900 dark:text-white">
                      {user.name}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-red-500/20 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user.total_booths} booth{user.total_booths !== 1 ? "s" : ""}
                    {user.active_booths < user.total_booths && (
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {" "}({user.active_booths} active)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 dark:text-green-500">
                    {formatCurrency(user.revenue)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No users found matching your criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {users.length} of {data.total} users
            {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Detail Panel */}
      {selectedUserId && (
        <UserDetailPanel
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
