/**
 * Admin Tickets React Query Hooks
 *
 * React Query hooks for admin ticket management with caching.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTickets,
  getAdminTicketDetail,
  updateAdminTicket,
  addAdminMessage,
} from "./services";
import type {
  AdminTicketsQueryParams,
  UpdateTicketRequest,
  AdminAddMessageRequest,
} from "./types";

/**
 * Query keys for admin tickets cache management
 */
export const adminTicketKeys = {
  all: ["admin-tickets"] as const,
  lists: () => [...adminTicketKeys.all, "list"] as const,
  list: (params?: AdminTicketsQueryParams) =>
    [...adminTicketKeys.lists(), params] as const,
  details: () => [...adminTicketKeys.all, "detail"] as const,
  detail: (ticketId: number) => [...adminTicketKeys.details(), ticketId] as const,
};

/**
 * Hook to fetch all tickets with summary stats
 *
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with tickets list and summary
 *
 * @example
 * const { data, isLoading } = useAdminTickets({ status: "open" });
 * console.log(data?.summary.critical_tickets);
 */
export function useAdminTickets(params: AdminTicketsQueryParams = {}) {
  return useQuery({
    queryKey: adminTicketKeys.list(params),
    queryFn: () => getAdminTickets(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch ticket detail with conversation history
 *
 * @param ticketId - The ticket ID
 * @returns React Query result with ticket detail
 *
 * @example
 * const { data: ticket } = useAdminTicketDetail(1);
 * ticket?.messages.forEach(m => console.log(m.message));
 */
export function useAdminTicketDetail(ticketId: number) {
  return useQuery({
    queryKey: adminTicketKeys.detail(ticketId),
    queryFn: () => getAdminTicketDetail(ticketId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: ticketId > 0,
  });
}

/**
 * Hook to update ticket status/priority/assignment
 *
 * @returns Mutation for updating tickets
 *
 * @example
 * const { mutate: update } = useUpdateAdminTicket();
 * update({ ticketId: 1, data: { status: "in_progress" } });
 */
export function useUpdateAdminTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: number;
      data: UpdateTicketRequest;
    }) => updateAdminTicket(ticketId, data),
    onSuccess: (_, variables) => {
      // Invalidate ticket detail
      queryClient.invalidateQueries({
        queryKey: adminTicketKeys.detail(variables.ticketId),
      });
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: adminTicketKeys.lists() });
    },
  });
}

/**
 * Hook to add an admin reply to a ticket
 *
 * @param ticketId - The ticket ID to reply to
 * @returns Mutation for adding messages
 *
 * @example
 * const { mutate: reply } = useAddAdminMessage(ticketId);
 * reply({ message: "We are looking into this..." });
 */
export function useAddAdminMessage(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminAddMessageRequest) => addAdminMessage(ticketId, data),
    onSuccess: () => {
      // Invalidate ticket detail to show new message
      queryClient.invalidateQueries({
        queryKey: adminTicketKeys.detail(ticketId),
      });
      // Invalidate lists to update message count
      queryClient.invalidateQueries({ queryKey: adminTicketKeys.lists() });
    },
  });
}
