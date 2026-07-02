"use client";

/**
 * Delete Account Modal
 *
 * Permanently deletes the user's account via DELETE /api/v1/users/{user_id}
 * (same endpoint the mobile app uses). Because the action is irreversible, it
 * gates on a type-to-confirm step (the user must type their email) on top of
 * the explicit warning — a stronger guard than the mobile app's single native
 * confirm, which is warranted on a shared-device web dashboard.
 *
 * On success the account is gone server-side; the session teardown (sign out,
 * clear caches, hard-redirect to /signin) lives in `useDeleteAccount`'s own
 * onSuccess so it runs even if this modal unmounts mid-delete. This component
 * only drives the confirmation UI and blocks itself from closing while the
 * delete is in flight.
 *
 * @see photobooth-app/app/(tabs)/settings.tsx (delete-account flow)
 */

import { useState } from "react";
import { useDeleteAccount } from "@/core/api/users";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";

interface DeleteAccountModalProps {
	userId: string | null;
	email: string | null;
	onClose: () => void;
}

/**
 * Mount this only while the dialog should be open (e.g. `{open && <Modal />}`).
 * Mounting fresh per open gives clean state (empty confirmation, no stale
 * mutation error) without a reset effect.
 */
export function DeleteAccountModal({
	userId,
	email,
	onClose,
}: DeleteAccountModalProps) {
	const del = useDeleteAccount();
	const [confirmText, setConfirmText] = useState("");

	// Once the delete succeeds, the hook's onSuccess is signing out + redirecting,
	// so treat success as still-busy: keep the dialog locked and the button spinning
	// until the navigation actually happens.
	const busy = del.isPending || del.isSuccess;

	// Block closing (Escape / backdrop) while a delete is in flight so the modal
	// can't unmount before the redirect. (Cancel is disabled separately.)
	const dialogRef = useDialogFocusTrap<HTMLDivElement>({
		open: true,
		onClose: busy ? () => {} : onClose,
	});

	// Confirm against the user's own email. If identity data isn't loaded
	// (no email/userId), the gate is intentionally impossible to pass — an
	// irreversible action must not fall back to a generic confirmation string.
	const target = email?.trim() ?? "";
	const matches =
		target.length > 0 &&
		confirmText.trim().toLowerCase() === target.toLowerCase();
	const canDelete = !!userId && matches && !busy;

	const handleDelete = () => {
		if (!userId || !matches) return;
		// Teardown (sign out + redirect) lives in the hook's onSuccess so it runs
		// even if this modal unmounts before the request settles.
		del.mutate({ userId });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close"
				tabIndex={-1}
				className="absolute inset-0 bg-black/60 cursor-default"
				onClick={busy ? undefined : onClose}
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-account-title"
				aria-describedby="delete-account-desc"
				className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)] p-6"
			>
				<div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
					<svg
						className="w-6 h-6 text-red-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.8}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
				</div>

				<h3
					id="delete-account-title"
					className="text-lg font-bold text-zinc-900 dark:text-white"
				>
					Delete account
				</h3>
				<p
					id="delete-account-desc"
					className="text-sm text-zinc-500 mt-2"
				>
					This permanently deletes your BoothIQ account and all associated data —
					booths, templates, and settings. This cannot be undone.
				</p>

				<label
					htmlFor="delete-account-confirm"
					className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-5 mb-2"
				>
					Type{" "}
					<span className="font-semibold text-zinc-900 dark:text-white">
						{target}
					</span>{" "}
					to confirm
				</label>
				<input
					id="delete-account-confirm"
					type="text"
					autoComplete="off"
					autoCapitalize="none"
					spellCheck={false}
					value={confirmText}
					onChange={(e) => setConfirmText(e.target.value)}
					disabled={busy}
					placeholder={target}
					className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 disabled:opacity-50"
				/>

				{del.error && (
					<div
						role="alert"
						className="p-3 mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500"
					>
						{del.error.message}
					</div>
				)}

				<div className="flex gap-3 mt-6">
					<button
						type="button"
						onClick={onClose}
						disabled={busy}
						className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={!canDelete}
						className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{busy && (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						)}
						{del.isPending
							? "Deleting..."
							: del.isSuccess
								? "Signing out..."
								: "Delete account"}
					</button>
				</div>
			</div>
		</div>
	);
}
