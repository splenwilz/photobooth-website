/**
 * Shared loading skeleton for the Cash screen (card + history), so the
 * placeholder styling lives in one place and can't drift between them.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`}
    />
  );
}
