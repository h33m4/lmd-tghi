"use server";

type Props = {
  countryName: string;
};

type ProgramDataResponse = {
  data?: any;
  error?: string;
};

async function getProgramData(
  countryName: string
): Promise<ProgramDataResponse> {
  try {
    const response = await fetch(
      `${process.env.LMD_API_BASE_URL}/program_data/programs/${countryName}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching program data:", errorText);
      throw new Error(`${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error("Error caught in getProgramData:", error.message);
    return { error: error.message };
  }
}

export default getProgramData;
