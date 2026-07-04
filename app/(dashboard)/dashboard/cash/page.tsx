"use client";

/**
 * Cash Page
 *
 * Booth-scoped view (via `?booth=<id>`) of the PHYSICAL cash box: the live
 * balance sitting in the bill acceptors since the last "Collect", plus the
 * append-only collection history. Deliberately separate from revenue (the
 * dashboard's Payment Methods card is takings attribution; this is money
 * physically in the machine).
 *
 * The live snapshot rides the booth overview response (`useBoothDetail`), so no
 * dedicated fetch is needed for the balance. In "All Booths" mode there is no
 * per-booth snapshot to show, so we prompt the operator to pick a booth.
 *
 * Note: collection is a physical action recorded on the kiosk — the cloud API
 * exposes no owner-facing "collect" endpoint, so this screen is read-only.
 *
 * @see GET /api/v1/booths/{booth_id}/overview  (cash_box object)
 */

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useBoothDetail, useBoothList } from "@/core/api/booths";
import { ApiError } from "@/core/api/client";
import { CashBoxCard } from "./CashBoxCard";
import { CashCollections } from "./CashCollections";
import { Skeleton } from "./Skeleton";

export default function CashPage() {
  const searchParams = useSearchParams();
  const boothId = searchParams.get("booth");

  const queryClient = useQueryClient();
  const { data: boothList } = useBoothList();
  const selectedBooth = boothList?.booths.find((b) => b.id === boothId);

  const boothDetailQuery = useBoothDetail(boothId);
  const boothData = boothDetailQuery.data;

  // 3-element prefix matches every paginated variant of this booth's history.
  const cashCollectionsKey = ["booths", "cashCollections", boothId] as const;
  const collectionsFetching = useIsFetching({ queryKey: cashCollectionsKey });

  // No booth selected → prompt to pick one (the live snapshot is per-booth).
  if (!boothId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Cash Box
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Physical cash in each machine, not revenue
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
          <p className="font-medium text-zinc-900 dark:text-white">
            No booth selected
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Pick a booth from the selector above to see the cash sitting in its
            machine and its collection history.
          </p>
        </div>
      </div>
    );
  }

  // Prefer the authoritative name from the overview; once the booth list has
  // loaded with no match (unknown/deleted/foreign id) say so instead of an
  // indefinite "Loading…".
  const boothName =
    boothData?.booth_name ??
    selectedBooth?.name ??
    (boothList ? "Unknown booth" : "Loading…");

  const detailError = boothDetailQuery.error;
  const isNotFound =
    detailError instanceof ApiError && detailError.status === 404;

  const refreshing = boothDetailQuery.isFetching || collectionsFetching > 0;
  const handleRefresh = () => {
    boothDetailQuery.refetch();
    queryClient.invalidateQueries({ queryKey: cashCollectionsKey });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Cash Box
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {boothName} · physical cash in the machine, not revenue
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-2 rounded-lg text-sm text-[#069494] hover:bg-[#069494]/10 transition-colors disabled:opacity-50 shrink-0"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {boothDetailQuery.isError ? (
        // Unified error — the booth-detail failure is the page-level failure,
        // so we don't also render the history's separate error below.
        <div
          role="alert"
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4"
        >
          <p className="text-sm text-red-500">
            {isNotFound
              ? "Booth not found, or you don't have access to it."
              : detailError instanceof Error
                ? detailError.message
                : "Failed to load the cash box."}
          </p>
          {!isNotFound && (
            <button
              type="button"
              onClick={() => boothDetailQuery.refetch()}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 shrink-0"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Live snapshot */}
          {boothDetailQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["a", "b", "c"].map((k) => (
                <div
                  key={k}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-28 mt-3" />
                  <Skeleton className="h-3 w-20 mt-3" />
                </div>
              ))}
            </div>
          ) : (
            <CashBoxCard
              cashBox={boothData?.cash_box}
              boothStatus={boothData?.booth_status}
            />
          )}

          {/* Collection history — keyed so a booth switch resets pagination and
              can't show the previous booth's rows via keepPreviousData. */}
          <CashCollections key={boothId} boothId={boothId} />
        </>
      )}
    </div>
  );
}
