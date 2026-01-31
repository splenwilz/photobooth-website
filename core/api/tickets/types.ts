/**
 * Support Tickets API Types
 *
 * Type definitions for the support tickets API endpoints.
 */

// Priority levels for tickets
export type TicketPriority = "low" | "medium" | "high" | "critical";

// Ticket status values
export type TicketStatus = "open" | "pending" | "in_progress" | "resolved" | "closed";

/**
 * Ticket list item (from GET /tickets)
 */
export interface TicketListItem {
  id: number;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  booth_id: string | null;
  booth_name: string | null;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
}

/**
 * Query parameters for listing tickets
 */
export interface TicketsQueryParams {
  page?: number;
  per_page?: number;
  status?: "all" | TicketStatus;
}

/**
 * Response from GET /tickets
 */
export interface TicketsListResponse {
  tickets: TicketListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Attachment on a ticket message
 */
export interface TicketAttachment {
  id: number;
  filename: string;
  file_size: number;
  file_type: string;
  download_url: string;
}

/**
 * Message in ticket conversation
 */
export interface TicketMessage {
  id: number;
  sender_type: "user" | "admin";
  sender_name: string;
  message: string;
  attachments: TicketAttachment[];
  created_at: string;
}

/**
 * Ticket detail response (from GET /tickets/{id})
 */
export interface TicketDetailResponse {
  id: number;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  booth: { id: string; name: string } | null;
  assigned_to: string | null;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

/**
 * Request body for creating a new ticket
 */
export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: TicketPriority;
  booth_id?: string;
}

/**
 * Response from POST /tickets (create ticket)
 */
export interface CreateTicketResponse {
  id: number;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  booth_id: string | null;
  booth_name: string | null;
  message_count: number;
  created_at: string;
}

/**
 * Request body for adding a message to a ticket
 */
export interface AddMessageRequest {
  message: string;
  attachment_s3_keys?: string[];
}

/**
 * Response from POST /tickets/{id}/messages
 */
export interface AddMessageResponse extends TicketMessage {}

/**
 * Request body for getting upload URL
 */
export interface UploadUrlRequest {
  filename: string;
  content_type: string;
}

/**
 * Response from POST /tickets/{id}/upload-url
 */
export interface UploadUrlResponse {
  upload_url: string;
  s3_key: string;
  expires_in: number;
}
