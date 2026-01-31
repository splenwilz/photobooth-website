"use client";

/**
 * Ticket Detail Page
 *
 * Shows ticket information and conversation history with reply form.
 */

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useTicketDetail,
  useAddMessage,
  useGetUploadUrl,
  type TicketStatus,
  type TicketMessage,
  type TicketAttachment,
} from "@/core/api/tickets";

// Loading skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`}
    />
  );
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Get status badge styling
function getStatusConfig(status: TicketStatus) {
  switch (status) {
    case "open":
      return { label: "Open", bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" };
    case "pending":
      return { label: "Pending", bg: "bg-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400" };
    case "in_progress":
      return { label: "In Progress", bg: "bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" };
    case "resolved":
      return { label: "Resolved", bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400" };
    case "closed":
      return { label: "Closed", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    default:
      return { label: status, bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
  }
}

// Get priority badge styling
function getPriorityConfig(priority: string) {
  switch (priority) {
    case "low":
      return { label: "Low", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    case "medium":
      return { label: "Medium", bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" };
    case "high":
      return { label: "High", bg: "bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" };
    case "critical":
      return { label: "Critical", bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400" };
    default:
      return { label: priority, bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
  }
}

// Message component
function MessageBubble({ message, isUser }: { message: TicketMessage; isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-[#0891B2] text-white rounded-2xl rounded-br-md"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl rounded-bl-md"
        }`}
      >
        <div className="px-4 py-3">
          <div className={`text-xs mb-1 ${isUser ? "text-white/70" : "text-zinc-500"}`}>
            {message.sender_name} · {formatDate(message.created_at)}
          </div>
          <p className="whitespace-pre-wrap">{message.message}</p>

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} isUser={isUser} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Attachment display component
function AttachmentItem({ attachment, isUser }: { attachment: TicketAttachment; isUser: boolean }) {
  const isImage = attachment.file_type?.startsWith("image/") ?? false;

  return (
    <a
      href={attachment.download_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isUser
          ? "bg-white/10 hover:bg-white/20"
          : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
      }`}
    >
      {isImage ? (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.filename}</p>
        <p className={`text-xs ${isUser ? "text-white/60" : "text-zinc-500"}`}>
          {formatFileSize(attachment.file_size)}
        </p>
      </div>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </a>
  );
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = parseInt(params.ticketId as string, 10);

  const [replyMessage, setReplyMessage] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedAttachmentKeys, setUploadedAttachmentKeys] = useState<string[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ticket, isLoading, error } = useTicketDetail(ticketId);
  const { mutate: sendMessage, isPending: isSending } = useAddMessage(ticketId);
  const { mutateAsync: getUploadUrl } = useGetUploadUrl(ticketId);

  const isClosed = ticket?.status === "closed";
  const canReply = !isClosed && replyMessage.trim().length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...files]);
    // Clear uploaded keys since file list changed
    setUploadedAttachmentKeys([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    // Clear uploaded keys since file list changed
    setUploadedAttachmentKeys([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReply) return;

    // Clear any previous send error
    setSendError(null);

    // Reuse already-uploaded keys if retrying after a send failure
    let attachmentKeys = [...uploadedAttachmentKeys];

    // Upload files only if we have pending files that haven't been uploaded yet
    if (pendingFiles.length > 0 && uploadedAttachmentKeys.length === 0) {
      setUploadingFiles(true);
      setUploadError(null);
      try {
        for (const file of pendingFiles) {
          const { upload_url, s3_key } = await getUploadUrl({
            filename: file.name,
            content_type: file.type || "application/octet-stream",
          });

          // Upload to S3
          const uploadResponse = await fetch(upload_url, {
            method: "PUT",
            headers: { "Content-Type": file.type || "application/octet-stream" },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }

          attachmentKeys.push(s3_key);
        }
        // Store uploaded keys so retries don't re-upload
        setUploadedAttachmentKeys(attachmentKeys);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Failed to upload files. Please try again.");
        return;
      } finally {
        setUploadingFiles(false);
      }
    }

    // Send message
    sendMessage(
      {
        message: replyMessage.trim(),
        attachment_s3_keys: attachmentKeys.length > 0 ? attachmentKeys : undefined,
      },
      {
        onSuccess: () => {
          // Clear all states on success
          setReplyMessage("");
          setPendingFiles([]);
          setUploadedAttachmentKeys([]);
          setSendError(null);
          setUploadError(null);
        },
        onError: (err) => {
          setSendError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Back button skeleton */}
        <Skeleton className="w-32 h-6" />

        {/* Header skeleton */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <Skeleton className="w-24 h-5 mb-2" />
          <Skeleton className="w-64 h-7 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
        </div>

        {/* Messages skeleton */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
          <div className="flex justify-end">
            <Skeleton className="w-2/3 h-24 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="w-2/3 h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Support
        </Link>

        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            {error ? "Failed to load ticket. Please try again." : "Ticket not found."}
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/support"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Support
      </Link>

      {/* Ticket Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono text-[#0891B2] mb-1">{ticket.ticket_number}</p>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{ticket.subject}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.label}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                {priorityConfig.label}
              </span>
              {ticket.booth && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-500/20 text-zinc-600 dark:text-zinc-400">
                  {ticket.booth.name}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            Created {formatDate(ticket.created_at)}
          </p>
        </div>
      </div>

      {/* Closed Notice */}
      {isClosed && (
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] flex items-center gap-3">
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This ticket has been closed. If you need further assistance, please create a new ticket.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Conversation</h2>
        <div className="space-y-4">
          {ticket.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.sender_type === "user"}
            />
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {!isClosed && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Reply</h2>

          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white placeholder-zinc-500 resize-none"
          />

          {/* Pending Files */}
          {pendingFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {pendingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <span className="flex-1 text-sm text-zinc-900 dark:text-white truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300 mt-1 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Send Error */}
          {sendError && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-600 dark:text-red-400">{sendError}</p>
                <p className="text-xs text-red-500 mt-1">Click &quot;Send Reply&quot; to retry. Your files are already uploaded.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                Attach Files
              </button>
            </div>

            <button
              type="submit"
              disabled={!canReply || isSending || uploadingFiles}
              className="px-6 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isSending || uploadingFiles) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {uploadingFiles ? "Uploading..." : "Sending..."}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send Reply
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
