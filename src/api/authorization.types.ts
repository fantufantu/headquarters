import type { ActionCode, ResourceCode } from "./enums.types";

export interface Authorization {
  id: number;
  resourceCode: ResourceCode;
  actionCode: ActionCode;
}
