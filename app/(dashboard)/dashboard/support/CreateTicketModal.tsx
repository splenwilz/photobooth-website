"use client";

/**
 * Create Ticket Modal
 *
 * Modal for creating a new support ticket.
 */

import { useState } from "react";
import { useCreateTicket, type TicketPriority } from "@/core/api/tickets";
import { useBoothList } from "@/core/api/booths";

interface CreateTicketModalProps {
  onClose: () => void;
  onSuccess: (ticketId: number) => void;
}

export default function CreateTicketModal({ onClose, onSuccess }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [boothId, setBoothId] = useState<string>("");

  const { data: boothData } = useBoothList();
  const booths = boothData?.booths ?? [];

  const { mutate: createTicket, isPending, error } = useCreateTicket();

  const isValid = subject.length >= 5 && message.length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    createTicket(
      {
        subject,
        message,
        priority,
        booth_id: boothId || undefined,
      },
      {
        onSuccess: (data) => {
          onSuccess(data.id);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#111111] rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create Support Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              minLength={5}
              maxLength={200}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white placeholder-zinc-500"
            />
            <p className="text-xs text-zinc-500 mt-1">{subject.length}/200 characters (min 5)</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              minLength={10}
              rows={5}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white placeholder-zinc-500 resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">{message.length} characters (min 10)</p>
          </div>

          {/* Priority & Booth Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Booth */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Related Booth
              </label>
              <select
                value={boothId}
                onChange={(e) => setBoothId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white"
              >
                <option value="">None (General)</option>
                {booths.map((booth) => (
                  <option key={booth.id} value={booth.id}>
                    {booth.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : "Failed to create ticket. Please try again."}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
