/**
 * Support Tickets API Module
 *
 * Exports types, services, and React Query hooks for support ticket management.
 *
 * @example
 * import {
 *   useTickets,
 *   useTicketDetail,
 *   useCreateTicket,
 *   useAddMessage,
 *   type TicketListItem,
 *   type TicketDetailResponse,
 * } from "@/core/api/tickets";
 */

// Types
export type {
  TicketPriority,
  TicketStatus,
  TicketListItem,
  TicketsQueryParams,
  TicketsListResponse,
  TicketAttachment,
  TicketMessage,
  TicketDetailResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  AddMessageRequest,
  AddMessageResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "./types";

// Services
export {
  getTickets,
  getTicketDetail,
  createTicket,
  addMessage,
  getUploadUrl,
} from "./services";

// React Query hooks
export {
  ticketKeys,
  useTickets,
  useTicketDetail,
  useCreateTicket,
  useAddMessage,
  useGetUploadUrl,
} from "./queries";
