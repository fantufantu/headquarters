import type { ActionCode, ResourceCode } from "@/constants/enums";

export interface Authorization {
  id: number;
  resourceCode: ResourceCode;
  actionCode: ActionCode;
}
