import { Suspense } from "react";

import { SubscriptionCancelledForm } from "./SubscriptionCancelledForm";

export default function SubscriptionCancelledPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <Suspense
        fallback={
          <div className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-8 text-center">
            <div className="w-8 h-8 mx-auto mb-3 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        }
      >
        <SubscriptionCancelledForm />
      </Suspense>
    </div>
  );
}
