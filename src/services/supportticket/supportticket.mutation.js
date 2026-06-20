import { useMutation } from "@tanstack/react-query";
import { replySupportTicket, replySupportTicketWithAttachment } from "./supportticket.service";

export const useReplySupportTicketMutation = () => {
  return useMutation({
    mutationFn: payload => {
      if (payload?.attachment) {
        return replySupportTicketWithAttachment(payload);
      }

      return replySupportTicket(payload);
    },
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
