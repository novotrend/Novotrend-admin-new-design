import { useQuery } from "@tanstack/react-query";
import { getBounsList, getCancelList, getDiscountList } from "./bouns.service";

export const useBounsListQuery = ({ limit = 10, offset = 0, search = "" }) => {
  return useQuery({
    queryKey: ["bonus-list", limit, offset, search],

    queryFn: () =>
      getBounsList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

export const useCancelListQuery = ({ limit = 10, offset = 0, search = "" }) => {
  return useQuery({
    queryKey: ["cancel-list", limit, offset, search],

    queryFn: () =>
      getCancelList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};

export const useDiscountListQuery = ({ limit = 10, offset = 0, search = "" }) => {
  return useQuery({
    queryKey: ["discount-list", limit, offset, search],

    queryFn: () =>
      getDiscountList({
        limit,
        offset,
        search,
      }),

    keepPreviousData: true,
  });
};
