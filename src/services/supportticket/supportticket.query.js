import { useQuery } from "@tanstack/react-query";
import {
  getCloseSupportTicketList,
  getOpenSupportTicketList,
  getSupportTicketDetails,
} from "./supportticket.service";

export const useOpenSupportTicketListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["open-support-ticket-list", limit, offset, search],
    queryFn: () =>
      getOpenSupportTicketList({
        limit,
        offset,
        search,
      }),
  });
};

export const useCloseSupportTicketListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["close-support-ticket-list", limit, offset, search],
    queryFn: () =>
      getCloseSupportTicketList({
        limit,
        offset,
        search,
      }),
  });
};

export const useSupportTicketDetailsQuery = ({ ticket_id }) => {
  return useQuery({
    queryKey: ["support-ticket-details", ticket_id],
    queryFn: () =>
      getSupportTicketDetails({
        ticket_id,
      }),
    enabled: Boolean(ticket_id),
  });
};
