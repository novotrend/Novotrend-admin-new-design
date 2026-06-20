import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  moveIB,
  getRejectedIBList,
  getIBList,
  getIBCommissionList,
  getIBLevelList,
  getIBLevelWiseUserDetail,
  getApprovedIBList,
  deactivateIBUser,
  ibRequestAction,
  getPendingIBList,
  ibWithdrawalAction1,
  getIBWithdrawalRequestList,
  getRejectedIBListRequst,
  getAcceptedIBWithdrawalList,
  getIBRewardList,
} from "./ib-managment.service";

// IB LIST
export const useIBList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["ib-list", limit, offset, search],
    queryFn: () =>
      getIBList({
        limit,
        offset,
        search,
      }),
  });
};

// IB DOWNLINE
export const useIBLevelList = ({ email }) => {
  return useQuery({
    queryKey: ["ib-level-list", email],
    queryFn: () =>
      getIBLevelList({
        user_ref_code: email,
      }),
    enabled: !!email,
  });
};

// IB SHOWDETAILS

export const useIBLevelWiseUserDetail = ({ encodedIds }) => {
  return useQuery({
    queryKey: ["ib-levelwise-user-detail", encodedIds],
    queryFn: () =>
      getIBLevelWiseUserDetail({
        totalid: encodedIds,
      }),
    enabled: !!encodedIds,
  });
};

// IB COMMISSION LIST
export const useIBCommissionList = ({ limit, offset, search, ibUser }) => {
  return useQuery({
    queryKey: ["ib-commission-list", limit, offset, search, ibUser],
    queryFn: () =>
      getIBCommissionList({
        limit,
        offset,
        search,
        ib_user: ibUser,
      }),
    enabled: !!ibUser,
  });
};

// REJECTED IB LIST
export const useRejectedIBList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["rejected-ib-list", limit, offset, search],
    queryFn: () =>
      getRejectedIBList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

// IB-MOVE
export const useIBMoveMutation = () => {
  return useMutation({
    mutationFn: moveIB,
  });
};

// Section IB - List of become IB

export const useApprovedIBList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["approved-ib-list", limit, offset, search],
    queryFn: () =>
      getApprovedIBList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

// action - deactive

export const useDeactivateIBUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateIBUser,

    onSuccess: (response) => {
      toast.success(
        response?.message ||
          response?.result ||
          "IB account deactivated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["approved-ib-list"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    },
  });
};

// Section IB - request list

export const usePendingIBList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["pending-ib-list", limit, offset, search],

    queryFn: () =>
      getPendingIBList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

export const useIBRequestAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ibRequestAction,

    onSuccess: (response) => {
      toast.success(
        response?.message ||
          response?.result ||
          "Action completed successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["pending-ib-list"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    },
  });
};

// Withdrowals list
export const useIBWithdrawalRequestList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["ib-withdrawal-request-list", limit, offset, search],

    queryFn: () =>
      getIBWithdrawalRequestList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

// actions
export const useIBWithdrawalAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ibWithdrawalAction1,

    onSuccess: (response) => {
      toast.success(
        response?.message ||
          response?.result ||
          "Withdrawal request updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["ib-withdrawal-request-list"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    },
  });
};

// Reject IB Request
export const useRejectedIBListRequest = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["rejected-ib-withdrawal-list", limit, offset, search],

    queryFn: () =>
      getRejectedIBListRequst({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

// Accepted IB List
export const useAcceptedIBWithdrawalList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["accepted-ib-withdrawal-list", limit, offset, search],

    queryFn: () =>
      getAcceptedIBWithdrawalList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

// Reward list
export const useIBRewardList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["ib-reward-list", limit, offset, search],

    queryFn: () =>
      getIBRewardList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};
