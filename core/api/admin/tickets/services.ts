/**
 * Admin Tickets API Services
 *
 * Service functions for admin support ticket management.
 */

import { apiClient } from "@/core/api/client";
import type {
  AdminTicketsQueryParams,
  AdminTicketsListResponse,
  AdminTicketDetailResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
  AdminAddMessageRequest,
  AdminAddMessageResponse,
} from "./types";

const ADMIN_TICKETS_BASE = "/api/v1/admin/tickets";

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
 * Get paginated list of all tickets with summary stats
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Tickets list with summary
 *
 * @example
 * const { summary, tickets } = await getAdminTickets({
 *   status: "open",
 *   priority: "critical"
 * });
 * console.log(`${summary.critical_tickets} critical tickets`);
 */
export async function getAdminTickets(
  params: AdminTicketsQueryParams = {}
): Promise<AdminTicketsListResponse> {
  const queryString = buildQueryString(params);
  return apiClient<AdminTicketsListResponse>(
    `${ADMIN_TICKETS_BASE}${queryString}`
  );
}

/**
 * Get ticket detail with full conversation history
 *
 * @param ticketId - The ticket ID
 * @returns Ticket detail with messages
 *
 * @example
 * const ticket = await getAdminTicketDetail(1);
 * console.log(ticket.user_name, ticket.subject);
 */
export async function getAdminTicketDetail(
  ticketId: number
): Promise<AdminTicketDetailResponse> {
  return apiClient<AdminTicketDetailResponse>(
    `${ADMIN_TICKETS_BASE}/${ticketId}`
  );
}

/**
 * Update ticket status, priority, or assignment
 *
 * @param ticketId - The ticket ID
 * @param data - Update data
 * @returns Updated ticket info
 *
 * @example
 * await updateAdminTicket(1, {
 *   status: "in_progress",
 *   assigned_to: "admin_user_id"
 * });
 */
export async function updateAdminTicket(
  ticketId: number,
  data: UpdateTicketRequest
): Promise<UpdateTicketResponse> {
  return apiClient<UpdateTicketResponse>(`${ADMIN_TICKETS_BASE}/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Add an admin reply to a ticket
 *
 * @param ticketId - The ticket ID
 * @param data - Message data
 * @returns Created message
 *
 * @example
 * await addAdminMessage(1, {
 *   message: "We have identified the issue..."
 * });
 */
export async function addAdminMessage(
  ticketId: number,
  data: AdminAddMessageRequest
): Promise<AdminAddMessageResponse> {
  return apiClient<AdminAddMessageResponse>(
    `${ADMIN_TICKETS_BASE}/${ticketId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
