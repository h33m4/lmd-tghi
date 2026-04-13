"use server";

type KpiTableNamesResponse = {
  data?: any;
  error?: string;
};

async function getKpiTableNames(
  country: string
): Promise<KpiTableNamesResponse> {
  try {
    if (!country) return { error: "No country name passed" };
    const response = await fetch(
      `${process.env.LMD_API_BASE_URL}/kpi_data/datasets/${country}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    // console.log(data);
    return { data };
  } catch (error: any) {
    console.error("Error caught in getKpiTableNames:", error.message);
    return { error: error.message };
  }
}

export default getKpiTableNames;
