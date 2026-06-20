// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
//  import { editExchangerValue } from "./exchanger-edit.service";

// export const useEditExchangerMutation = () => {
//   return useMutation({
//     mutationFn: editExchangerValue,

//     onSuccess: (response) => {
//       toast.success(
//         response?.message ||
//           response?.result ||
//           "Exchange value updated successfully",
//       );
//     },

//     onError: (error) => {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Something went wrong",
//       );
//     },
//   });
// };
