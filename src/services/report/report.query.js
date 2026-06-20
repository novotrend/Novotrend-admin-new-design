import { useQuery } from "@tanstack/react-query";
import {
  getInternalTransferReport,
  getWalletReport,
  getWalletRequestListHistory,
  getWithdrawalRequestListHistory,
  getWithdrawalRequestListHistoryIB,
} from "./report.service";

export const useWalletReportQuery = ({ limit, offset, search, sdate, edate }) => {
  return useQuery({
    queryKey: ["wallet-report", limit, offset, sdate, search, edate],
    queryFn: () =>
      getWalletReport({
        limit,
        offset,
        sdate,
        edate,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useInternalTransferReportQuery = ({ limit, offset, search, sdate, edate }) => {
  return useQuery({
    queryKey: ["wallet-internal-transfer", limit, offset, sdate, search, edate],
    queryFn: () =>
      getInternalTransferReport({
        limit,
        offset,
        sdate,
        edate,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useWalletRequestHistoryQuery = ({
  limit,
  offset,
  search,
  sdate,
  edate,
  useremail,
  paytype,
  status,
}) => {
  return useQuery({
    queryKey: [
      "wallet-request-history",
      { limit, offset, search, sdate, edate, useremail, paytype, status },
    ],
    queryFn: () =>
      getWalletRequestListHistory({
        limit,
        offset,
        search,
        sdate,
        edate,
        useremail,
        paytype,
        status,
      }),
    placeholderData: previous => previous,
  });
};

export const useWithdrawalRequestHistoryQuery = ({
  limit,
  offset,
  search,
  sdate,
  edate,
  useremail,
  paytype,
  status,
}) => {
  return useQuery({
    queryKey: [
      "withdrawal-request-history",
      { limit, offset, search, sdate, edate, useremail, paytype, status },
    ],
    queryFn: () =>
      getWithdrawalRequestListHistory({
        limit,
        offset,
        search,
        sdate,
        edate,
        useremail,
        paytype,
        status,
      }),
    placeholderData: previous => previous,
  });
};

export const useWithdrawalRequestHistoryIBQuery = ({
  limit,
  offset,
  search,
  sdate,
  edate,
  useremail,
  paytype,
  status,
}) => {
  return useQuery({
    queryKey: [
      "withdrawal-request-history-ib",
      { limit, offset, search, sdate, edate, useremail, paytype, status },
    ],
    queryFn: () =>
      getWithdrawalRequestListHistoryIB({
        limit,
        offset,
        search,
        sdate,
        edate,
        useremail,
        paytype,
        status,
      }),
    placeholderData: previous => previous,
  });
};
