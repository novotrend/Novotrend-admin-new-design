import { useQuery } from "@tanstack/react-query";
import { getMT5GroupList } from "./group.service";

export const useGetMT5GroupListQuery = ({
  limit = 10,
  offset = 0,
  search = "",
  status,
} = {}) => {
  return useQuery({
    queryKey: ["mt5-group-list", limit, offset, search, status],
    queryFn: async () => {
      return await getMT5GroupList({
        limit,
        offset,
        search,
        status,
      });
    },
  });
};
