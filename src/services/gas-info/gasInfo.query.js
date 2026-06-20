import { useQuery } from "@tanstack/react-query";
import { getGasInfo } from "./gasInfo.service";

export const useGasInfoQuery = ({ type_chain }) => {
  return useQuery({
    queryKey: ["gas-info", type_chain],
    queryFn: async () => {
      
      return await getGasInfo({
        type_chain,
      });
    },
    enabled: Boolean(type_chain),
  });
};
