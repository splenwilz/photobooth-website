/**
 * Support Tickets API Services
 *
 * Service functions for support ticket operations.
 */

import { apiClient } from "@/core/api/client";
import type {
  TicketsQueryParams,
  TicketsListResponse,
  TicketDetailResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  AddMessageRequest,
  AddMessageResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "./types";

const TICKETS_BASE = "/api/v1/tickets";

/**
 * Build query string from params object
 */
function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Get paginated list of user's tickets
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of tickets
 *
 * @example
 * const { tickets, total } = await getTickets({ status: "open", page: 1 });
 */
export async function getTickets(
  params: TicketsQueryParams = {}
): Promise<TicketsListResponse> {
  const queryString = buildQueryString(params);
  return apiClient<TicketsListResponse>(`${TICKETS_BASE}${queryString}`);
}

/**
 * Get ticket detail with full conversation history
 *
 * @param ticketId - The ticket ID
 * @returns Ticket detail with messages
 *
 * @example
 * const ticket = await getTicketDetail(1);
 * ticket.messages.forEach(m => console.log(m.sender_name, m.message));
 */
export async function getTicketDetail(
  ticketId: number
): Promise<TicketDetailResponse> {
  return apiClient<TicketDetailResponse>(`${TICKETS_BASE}/${ticketId}`);
}

/**
 * Create a new support ticket
 *
 * @param data - Ticket creation data
 * @returns Created ticket info
 *
 * @example
 * const ticket = await createTicket({
 *   subject: "Printer not working",
 *   message: "My printer stopped responding after the update...",
 *   priority: "high",
 *   booth_id: "booth-uuid"
 * });
 */
export async function createTicket(
  data: CreateTicketRequest
): Promise<CreateTicketResponse> {
  return apiClient<CreateTicketResponse>(TICKETS_BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Add a reply message to an existing ticket
 *
 * @param ticketId - The ticket ID
 * @param data - Message data
 * @returns Created message
 *
 * @example
 * const message = await addMessage(1, {
 *   message: "I tried restarting but it still doesn't work",
 *   attachment_s3_keys: ["tickets/1/abc123-screenshot.png"]
 * });
 */
export async function addMessage(
  ticketId: number,
  data: AddMessageRequest
): Promise<AddMessageResponse> {
  return apiClient<AddMessageResponse>(`${TICKETS_BASE}/${ticketId}/messages`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get a presigned S3 URL for uploading an attachment
 *
 * @param ticketId - The ticket ID
 * @param data - Upload info (filename, content_type)
 * @returns Presigned upload URL and S3 key
 *
 * @example
 * const { upload_url, s3_key } = await getUploadUrl(1, {
 *   filename: "screenshot.png",
 *   content_type: "image/png"
 * });
 * // Then upload directly to S3 using upload_url
 */
export async function getUploadUrl(
  ticketId: number,
  data: UploadUrlRequest
): Promise<UploadUrlResponse> {
  return apiClient<UploadUrlResponse>(
    `${TICKETS_BASE}/${ticketId}/upload-url`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
