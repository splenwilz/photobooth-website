/**
 * Support Tickets React Query Hooks
 *
 * React Query hooks for ticket operations with caching.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTickets,
  getTicketDetail,
  createTicket,
  addMessage,
  getUploadUrl,
} from "./services";
import type {
  TicketsQueryParams,
  CreateTicketRequest,
  AddMessageRequest,
  UploadUrlRequest,
} from "./types";

/**
 * Query keys for tickets cache management
 */
export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (params?: TicketsQueryParams) =>
    [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (ticketId: number) => [...ticketKeys.details(), ticketId] as const,
};

/**
 * Hook to fetch paginated list of user's tickets
 *
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with tickets list
 *
 * @example
 * const { data, isLoading } = useTickets({ status: "open", page: 1 });
 * data?.tickets.forEach(ticket => console.log(ticket.subject));
 */
export function useTickets(params: TicketsQueryParams = {}) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => getTickets(params),
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
 * const { data: ticket, isLoading } = useTicketDetail(1);
 * ticket?.messages.forEach(m => console.log(m.message));
 */
export function useTicketDetail(ticketId: number) {
  return useQuery({
    queryKey: ticketKeys.detail(ticketId),
    queryFn: () => getTicketDetail(ticketId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: ticketId > 0,
  });
}

/**
 * Hook to create a new support ticket
 *
 * @returns Mutation for creating tickets
 *
 * @example
 * const { mutate: create, isPending } = useCreateTicket();
 * create({
 *   subject: "Printer issue",
 *   message: "My printer stopped working...",
 *   priority: "high"
 * }, {
 *   onSuccess: (ticket) => router.push(`/dashboard/support/${ticket.id}`)
 * });
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => createTicket(data),
    onSuccess: () => {
      // Invalidate tickets list to show new ticket
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Hook to add a reply message to a ticket
 *
 * @param ticketId - The ticket ID to reply to
 * @returns Mutation for adding messages
 *
 * @example
 * const { mutate: reply, isPending } = useAddMessage(ticketId);
 * reply({ message: "Here's more info about the issue..." });
 */
export function useAddMessage(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMessageRequest) => addMessage(ticketId, data),
    onSuccess: () => {
      // Invalidate ticket detail to show new message
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      // Also invalidate lists to update message count
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Hook to get a presigned S3 upload URL
 *
 * @param ticketId - The ticket ID
 * @returns Mutation for getting upload URLs
 *
 * @example
 * const { mutateAsync: getUrl } = useGetUploadUrl(ticketId);
 * const { upload_url, s3_key } = await getUrl({
 *   filename: "screenshot.png",
 *   content_type: "image/png"
 * });
 * // Upload to S3, then use s3_key in addMessage
 */
export function useGetUploadUrl(ticketId: number) {
  return useMutation({
    mutationFn: (data: UploadUrlRequest) => getUploadUrl(ticketId, data),
  });
}
