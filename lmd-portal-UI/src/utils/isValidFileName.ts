export function isValidFileName(fileName: string): boolean {
  const regex = /^[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_\d{2}_\d{2}_\d{4}\.csv$/;
  return regex.test(fileName);
}

export function validateFileName(
  fileName: string,
  selectedProgram: string
): string {
  const regex = /^[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_\d{2}_\d{2}_\d{4}\.csv$/;

  if (!regex.test(fileName)) {
    throw new Error(
      "Filename pattern is invalid. It should follow this format: 'program_name_mm_dd_yyyy.csv'"
    );
  }

  if (selectedProgram && !fileName.includes(selectedProgram)) {
    throw new Error(
      `Incorrect filename, '${selectedProgram}' missing from the filename`
    );
  }

  return "Filename is valid!";

  // return regex.test(fileName);
}
