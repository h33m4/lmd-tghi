import { z } from "zod";

// Helper function to get the inner type by unwrapping optional/nullable wrappers
export const getInnerType = (zodType: z.ZodTypeAny): z.ZodTypeAny => {
  let currentType = zodType;

  // Keep unwrapping until we reach the core type
  while (
    currentType instanceof z.ZodOptional ||
    currentType instanceof z.ZodNullable
  ) {
    currentType = currentType._def.innerType;
  }

  return currentType;
};

// Helper function to check if a field should be a textarea
export const isTextAreaField = (zodType: z.ZodTypeAny): boolean => {
  const innerType = getInnerType(zodType);

  // Check for explicit textarea description
  if (
    zodType.description === "textarea" ||
    innerType.description === "textarea"
  ) {
    return true;
  }

  return false;

  // return (
  //   innerType instanceof z.ZodString &&
  //   (innerType._def.checks || []).some(
  //     (check: any) => check.kind === "min" && check.value >= 20
  //   )
  // );
};
