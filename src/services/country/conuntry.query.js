import { useQuery } from "@tanstack/react-query";
import { getCountryList } from "./country.service";

export const useCountryListQuery = () => {
  return useQuery({
    queryKey: ["country-list"],
    queryFn: getCountryList,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
