import { useMutation } from "@tanstack/react-query";
import { addMT5Group, editMT5Group, updateMT5Group } from "./group.service";

// ADD MT5 GROUP
export const useAddMT5GroupMutation = () => {
  return useMutation({
    mutationFn: addMT5Group,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

// EDIT MT5 GROUP
export const useEditMT5GroupMutation = () => {
  return useMutation({
    mutationFn: editMT5Group,

    onSuccess: data => {
          },

    onError: error => {
          },
  });
};

// UPDATE MT5 GROUP
export const useUpdateMT5GroupMutation = () => {
  return useMutation({
    mutationFn: updateMT5Group,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
