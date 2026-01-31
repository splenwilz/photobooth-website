/**
 * Admin Tickets API Module
 *
 * Exports types, services, and React Query hooks for admin ticket management.
 *
 * @example
 * import {
 *   useAdminTickets,
 *   useAdminTicketDetail,
 *   useUpdateAdminTicket,
 *   useAddAdminMessage,
 *   type AdminTicketListItem,
 * } from "@/core/api/admin/tickets";
 */

// Types
export type {
  TicketPriority,
  TicketStatus,
  TicketMessage,
  AdminTicketsSummary,
  AdminTicketListItem,
  AdminTicketsQueryParams,
  AdminTicketsListResponse,
  AdminTicketDetailResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
  AdminAddMessageRequest,
  AdminAddMessageResponse,
} from "./types";

// Services
export {
  getAdminTickets,
  getAdminTicketDetail,
  updateAdminTicket,
  addAdminMessage,
} from "./services";

// React Query hooks
export {
  adminTicketKeys,
  useAdminTickets,
  useAdminTicketDetail,
  useUpdateAdminTicket,
  useAddAdminMessage,
} from "./queries";
