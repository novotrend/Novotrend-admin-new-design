import { decryptData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addEmployee, deleteEmployeeDetails, editEmployeeDetails } from "./employee.service";

export const useAddEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployee,
    onSuccess: response => {
      let successMessage = "Employee created successfully";
      if (typeof response?.result === "string") {
        try {
          const decryptedResult = decryptData(response.result);
          successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        } catch (error) {
                  }
      }
      toast.success(successMessage);
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-list"],
      });
          },
    onError: error => {
      toast.error(error?.message || "Something went wrong");
          },
  });
};

export const useEditEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editEmployeeDetails,

    onSuccess: response => {
      let successMessage = "Employee updated successfully";

      try {
        if (typeof response?.result === "string") {
          const decryptedResult = decryptData(response.result);

          
          successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        }
      } catch (error) {
              }

      toast.success(successMessage);

      queryClient.invalidateQueries({
        queryKey: ["admin-staff-list"],
      });

          },

    onError: error => {
      toast.error(error?.message || "Something went wrong");

          },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployeeDetails,

    onSuccess: response => {
      let successMessage = "Employee deleted successfully";

      try {
        if (typeof response?.result === "string") {
          const decryptedResult = decryptData(response.result);
                    successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        }
      } catch (error) {
              }
      toast.success(successMessage);
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-list"],
      });

          },
    onError: error => {
      toast.error(error?.message || "Failed to delete employee");

          },
  });
};
