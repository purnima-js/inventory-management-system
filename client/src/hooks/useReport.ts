import { useQuery } from "@tanstack/react-query"
import { getMockReportData } from "../api/report-api"


export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getMockReportData,
  })
}
