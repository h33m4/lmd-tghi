interface ErrorMessages {
  [key: number]: string;
}

interface ErrorResponse {
  statusCode: number;
  errorMessage: string;
  technicalDetails: any;
}

export const apiErrorTitles: ErrorMessages = {
  400: "Invalid request format. Please check your file format.",
  401: "Unauthorized. Please check your authentication.",
  403: "Permission denied. You don't have access to upload to this location.",
  404: "Upload endpoint not found. Please contact support.",
  413: "File is too large. Maximum file size exceeded.",
  415: "Unsupported file type. Please check the allowed formats.",
  429: "Too many requests. Please try again later.",
  500: "Server error. Please try again later.",
  503: "Service unavailable. Please try again later.",
};
