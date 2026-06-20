import { useQuery } from "@tanstack/react-query";
import {
  getBankKycAcceptedList,
  getBankRejectHistoryList,
  getNewBankKycList,
  getNewKycApprove,
  getNewKycList,
  getRejectedKycHistoryList,
} from "./userkyc.service";

export const useNewKYCQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["new-kyc", limit, offset, search],
    queryFn: () =>
      getNewKycList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useNewAcceptKYCQuery = ({ limit, offset, search, sdate, edate }) => {
  return useQuery({
    queryKey: ["new-accept-kyc", limit, offset, search, sdate, edate],
    queryFn: () =>
      getNewKycApprove({
        limit,
        offset,
        search,
        sdate,
        edate,
      }),
    keepPreviousData: true,
  });
};

export const useNewBankKYCListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["new-bank-kyc", limit, offset, search],
    queryFn: () =>
      getNewBankKycList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useBankKycAcceptedListQuery = ({ limit, offset, search, sdate, edate }) => {
  return useQuery({
    queryKey: ["bank-accepted-kyc-list", limit, offset, search, sdate, edate],
    queryFn: () =>
      getBankKycAcceptedList({
        limit,
        offset,
        search,
        sdate,
        edate,
      }),
    keepPreviousData: true,
  });
};

export const useBankRejectedHistoryListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["bank-rejected-history-list", limit, offset, search],
    queryFn: () =>
      getBankRejectHistoryList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useRejectedKycHistoryListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["rejected-kyc-history-list", limit, offset, search],
    queryFn: () =>
      getRejectedKycHistoryList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};
