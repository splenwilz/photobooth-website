/**
 * Admin Tickets API Types
 *
 * Type definitions for admin support ticket management endpoints.
 */

import type { TicketPriority, TicketStatus, TicketMessage } from "../../tickets/types";

// Re-export common types
export type { TicketPriority, TicketStatus, TicketMessage };

/**
 * Summary stats in admin tickets list response
 */
export interface AdminTicketsSummary {
  total_tickets: number;
  open_tickets: number;
  pending_tickets: number;
  in_progress_tickets: number;
  critical_tickets: number;
}

/**
 * Admin ticket list item (includes user info)
 */
export interface AdminTicketListItem {
  id: number;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  user_id: string;
  user_name: string;
  user_email: string;
  booth_id: string | null;
  booth_name: string | null;
  assigned_to: string | null;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
}

/**
 * Query parameters for admin tickets list
 */
export interface AdminTicketsQueryParams {
  page?: number;
  per_page?: number;
  status?: "all" | TicketStatus;
  priority?: TicketPriority;
  search?: string;
  assigned_to?: string;
}

/**
 * Admin tickets list response
 */
export interface AdminTicketsListResponse {
  summary: AdminTicketsSummary;
  tickets: AdminTicketListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Admin ticket detail response (same as user but accessible for any ticket)
 */
export interface AdminTicketDetailResponse {
  id: number;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  user_id: string;
  user_name: string;
  user_email: string;
  booth: { id: string; name: string } | null;
  assigned_to: string | null;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

/**
 * Request body for updating a ticket
 */
export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
}

/**
 * Response from updating a ticket
 */
export interface UpdateTicketResponse {
  id: number;
  ticket_number: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  updated_at: string;
}

/**
 * Request body for admin message
 */
export interface AdminAddMessageRequest {
  message: string;
  attachment_s3_keys?: string[];
}

/**
 * Admin message response (same as TicketMessage)
 */
export interface AdminAddMessageResponse extends TicketMessage {}
