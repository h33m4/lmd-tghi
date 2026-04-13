import { IAdminCreateUserDataType } from "@/lib/actions/auth/handleAdminCreateUser";
import { IUserRowData } from "./UsersTable";

export function updateUserObject(
  originalObject: IUserRowData,
  userData: IAdminCreateUserDataType
): IUserRowData {
  const updatedAttributes = originalObject.Attributes.map((attribute) => {
    switch (attribute.Name) {
      case "custom:department":
        return { ...attribute, Value: userData.department || attribute.Value };
      case "name":
        return { ...attribute, Value: userData.name || attribute.Value };
      case "custom:title":
        return { ...attribute, Value: userData.title || attribute.Value };
      default:
        return attribute;
    }
  });

  return {
    ...originalObject,
    Attributes: updatedAttributes,
  };
}
