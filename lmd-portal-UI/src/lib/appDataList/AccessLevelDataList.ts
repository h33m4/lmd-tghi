export interface AccessLevelDataListType {
  id: string;
  name: string;
}

const AccessLevelDataList: AccessLevelDataListType[] = [
  { id: "1", name: "USER" },
  { id: "2", name: "PUBLISHER" },
  { id: "3", name: "ADMINISTRATOR" },
];

export default AccessLevelDataList;
