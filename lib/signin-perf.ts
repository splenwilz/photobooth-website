/**
 * Diagnostic logger for the signin pipeline.
 *
 * Disabled in production unless explicitly opted in via:
 *   - SIGNIN_PERF=1            (server)
 *   - NEXT_PUBLIC_SIGNIN_PERF=1 (client; baked at build time)
 *
 * Use for sign-in latency investigations only. Removing the env var (or
 * deploying without it) silences every [SIGNIN-PERF] log without code
 * changes.
 */

const ENABLED =
  process.env.NODE_ENV !== 'production' ||
  process.env.SIGNIN_PERF === '1' ||
  process.env.NEXT_PUBLIC_SIGNIN_PERF === '1';

export function signinPerfLog(payload: Record<string, unknown>): void {
  if (!ENABLED) return;
  console.log('[SIGNIN-PERF]', payload);
}
