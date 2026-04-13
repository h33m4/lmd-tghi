import { IReportData } from "./ReportCard";

export async function getReportById(
  id: string,
  reportsData: IReportData[]
): Promise<IReportData | undefined> {
  // In a real application, this would likely be a database query
  return reportsData.find((report) => report.id === id);
}
